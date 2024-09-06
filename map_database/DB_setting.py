from datetime import datetime, timedelta
import FinanceDataReader as fdr
from bs4 import BeautifulSoup
from fredapi import Fred
from pykrx import stock
import pymysql as pms
import yfinance as yf
import pandas as pd
import requests
import pymysql
import sys
import os



# Database information
database_info = open('./database_id.txt', 'r').readlines()

sql_file_path = database_info[0].replace('\n', '')
database_host_ip = database_info[1].replace('\n', '')
database_name = database_info[2].replace('\n', '')
database_id = database_info[3].replace('\n', '')
database_passwd = database_info[4].replace('\n', '')
database_charset = database_info[5].replace('\n', '')

# API KEY
API_key = open('./api_key.txt', 'r').readlines()

ko_bank_key = API_key[0].replace('\n', '')
fred_api_key = API_key[1].replace('\n', '')


# ================================================================== sample data ==================================================================
# per pbr 계산 함수
def get_per_pbr_df(ticker_symbol, start_date, end_date):
    # 주식 데이터 다운로드
    ticker = yf.Ticker(ticker_symbol)
    data = ticker.history(start=start_date, end=end_date)
    
    # 재무 데이터 다운로드
    financials = ticker.financials
    balance_sheet = ticker.balance_sheet
    
    # EPS 및 BVPS 계산
    try:
        net_income = financials.loc['Net Income'].iloc[0]  # 최신 데이터 사용
        shares_outstanding = ticker.info.get('sharesOutstanding', None)
        if shares_outstanding is None:
            raise ValueError("Shares outstanding not available")
        eps = net_income / shares_outstanding
        
        total_assets = balance_sheet.loc['Total Assets'].iloc[0]
        total_liabilities = balance_sheet.loc['Total Liabilities Net Minority Interest'].iloc[0]  # 대체 가능한 키 사용
        book_value = total_assets - total_liabilities
        bvps = book_value / shares_outstanding
    except Exception as e:
        print(f"Error calculating EPS or BVPS: {e}")
        return pd.DataFrame()  # 빈 데이터프레임 반환
    
    # 기간 동안의 주가 데이터를 기반으로 PER 및 PBR 계산
    per_list = []
    pbr_list = []
    dates = []
    
    for date, row in data.iterrows():
        avg_price = row['Close']
        per = avg_price / eps
        pbr = avg_price / bvps
        per_list.append(per)
        pbr_list.append(pbr)
        dates.append(date)
    
    # 데이터프레임 생성
    result_df = pd.DataFrame({
        'Date': dates,
        'PER': per_list,
        'PBR': pbr_list
    })
    
    result_df.set_index('Date', inplace=True)
    return result_df

# 날짜 형식 변환 함수 
# 2024Q1  -> 20240101 
# 2024    -> 20240101
# 202401  -> 20240101
def check_time_data(check_time) :
    if 'Q1' in check_time :
        check_time = f'{check_time[:4]}0101'
    elif 'Q2' in check_time :
        check_time = f'{check_time[:4]}0401'
    elif 'Q3' in check_time :
        check_time = f'{check_time[:4]}0701'
    elif 'Q4' in check_time :
        check_time = f'{check_time[:4]}1001'
    elif len(check_time) <= 4 :
        check_time = f'{check_time}0101'
    elif len(check_time) <= 6 :
        check_time = f'{check_time}01'
    return check_time

# 날짜 형식 변환 함수 (20240905 -> 2024-09-05)
def convert_date_format(date_str):
    return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"




# ================================================================== sample data ==================================================================

# tb_user_key
tb_user_key_data = {
    'user_id': [1, 2, 3, 4, 5],
    'uk_email': ['user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com', 'user5@example.com'],
    'uk_password': ['password1', 'password2', 'password3', 'password4', 'password5'],
    'uk_permission': [1, 1, 0, 1, 0]
}

# ion
tb_user_information_data = {
    'user_id': [1, 2, 3, 4, 5],
    'ui_name': ['User One', 'User Two', 'User Three', 'User Four', 'User Five'],
    'ui_birth_date': ['1990-01-01', '1985-02-15', '1995-03-30', '1980-04-25', '2000-05-20'],
    'ui_sex': [1, 0, 1, 0, 1],
    'ui_bank_num': ['1234567890', '1234567891', '1234567892', '1234567893', '1234567894'],
    'ui_caution': [0, 0, 0, 0, 0],
    'ui_phone_number': ['010123123', '010123234', '010123345', '010234123', '010234234']
}

# tb_finance
tb_user_finance_data = {
    'user_id': [1, 2, 3, 4, 5],
    'uf_capital': [10000, 20000, 15000, 25000, 5000],
    'uf_loan': [5000, 10000, 7500, 12000, 2000],
    'uf_installment_saving': [2000, 5000, 3000, 8000, 1000],
    'uf_deposit': [3000, 10000, 6000, 12000, 2000],
    'uf_target_budget': [15000, 30000, 22500, 40000, 8000]
}

# tb_chat_bot
tb_chat_bot_data = {
    'cb_id': [1, 2, 3, 4, 5],
    'user_id': [1, 2, 3, 4, 5],
    'cb_date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'cb_text': ['Welcome to the chat bot.', 'How can I assist you today?', 'Here is the information you requested.', 'Have a nice day!', 'Goodbye!']
}

# tb_stock_predict
tb_stock_predict_data = {
    'sp_id': [1, 2, 3, 4, 5],
    'sp_date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'sp_ss_predict': [55, 56, 57, 58, 59],
    'sp_ap_predict': [65, 66, 67, 68, 69],
    'sp_bit_predict': [35, 54, 78, 54, 66]
}

# tb_shares_held
tb_shares_held_data = {
    'sh_id': [1, 2, 3, 4, 5],
    'user_id': [1, 2, 3, 4, 5],
    'sc_id': [1, 2, 3, 4, 5],
    'sh_date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'sh_ss_count': [10, 20, 30, 40, 50],
    'sh_ap_count': [15, 25, 35, 45, 55],
    'sh_bit_count': [12, 33, 22, 15, 23]
}

# tb_received_paid
tb_received_paid_data = {
    'rp_id': [1, 2, 3, 4, 5],
    'user_id': [1, 2, 3, 4, 5],
    'rp_date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'rp_detail': ['Salary', 'Bonus', 'Dividend', 'Sale', 'Interest'],
    'rp_amount': [1000, 2000, 1500, 2500, 500],
    'rp_hold': [1, 0, 1, 0, 1],
    'rp_part': [0, 1, 0, 1, 0]
}

# tb_news
tb_news_data = {
    'news_id': [1, 2, 3, 4, 5],
    'news_date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'news_title': ['Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5'],
    'news_simple_text': ['Text 1', 'Text 2', 'Text 3', 'Text 4', 'Text 5'],
    'news_link': ['http://example.com/1', 'http://example.com/2', 'http://example.com/3', 'http://example.com/4', 'http://example.com/5']
}

# tb_news_chat_room
tb_news_chat_room_data = {
    'ncr_id': [1, 2, 3, 4, 5],
    'news_id': [1, 2, 3, 4, 5],
    'ncr_chat_message': ['Message 1', 'Message 2', 'Message 3', 'Message 4', 'Message 5'],
    'ncr_timestamp': [datetime.now(), datetime.now(), datetime.now(), datetime.now(), datetime.now()]
}


# ================================================================== stock data ==================================================================

print('============= stock data API Start =============')
print('Start time : ', datetime.today())

# 날짜 형식
start_day = '2014-01-01'
month_date = str(datetime.now().month)
day_date = str(datetime.now().day)
if len(month_date) == 1 :
    month_date = f'0{month_date}'
if len(day_date) == 1 :
    day_date = f'0{day_date}'
end_day = f'{datetime.now().year}-{month_date}-{day_date}' #'2024-08-28'

start_date = datetime(int(start_day[:4]), int(start_day[5:7]), int(start_day[8:10]))
end_date = datetime(int(end_day[:4]), int(end_day[5:7]), int(end_day[8:10]))

date_df = pd.DataFrame(index=pd.date_range(start=start_date, end=end_date))
df_len = [] # 데이터 길이를 조절하기 위한 리스트


# ************************************** tb_stock **************************************
fdr_start_year = start_day[:4]

# Samsung(005930)
samsung_stock = fdr.DataReader('005930', fdr_start_year) 
samsung_stock.rename(columns={'Close' : 'sc_ss_stock'}, inplace=True)
samsung_stock = samsung_stock['sc_ss_stock']

# Samsung PER, PBR, ROE
samsung_PER_PBR_ROE = stock.get_market_fundamental(start_day, end_day, "005930")[['PER', 'PBR']] # 삼성전자
samsung_PER_PBR_ROE.rename(columns={'PER' : 'sc_ss_per', 'PBR' : 'sc_ss_pbr'}, inplace=True)
samsung_PER_PBR_ROE['sc_ss_roe'] = samsung_PER_PBR_ROE['sc_ss_pbr'] / samsung_PER_PBR_ROE['sc_ss_per']

# Samsung Market Capitalization
ticker = "005930.KS"
samsung_data = yf.download(ticker, start=start_date, end=end_date)
close_prices = samsung_data['Close']
samsung = yf.Ticker(ticker)
shares_outstanding = samsung.info['sharesOutstanding']
samsung_market = close_prices * shares_outstanding
samsung_Market_Cap = pd.DataFrame({'sc_ss_mc': samsung_market})
samsung_Market_Cap['sc_ss_mc'] = samsung_Market_Cap['sc_ss_mc'].astype(str).map(lambda x : x+'00000')

# Apple(AAPL)
# Apple Stock
apple_stock = fdr.DataReader('AAPL', fdr_start_year) 
apple_stock.rename(columns={'Close' : 'sc_ap_stock'}, inplace=True)
apple_stock = apple_stock['sc_ap_stock']

# Apple PER, PBR, ROE
apple_PER_PBR_ROE = get_per_pbr_df("AAPL", start_day, end_day)
apple_PER_PBR_ROE.rename(columns={'PER' : 'sc_ap_per', 'PBR' : 'sc_ap_pbr'}, inplace=True)
apple_PER_PBR_ROE = apple_PER_PBR_ROE.reset_index(drop=False)
apple_PER_PBR_ROE['Date'] = apple_PER_PBR_ROE['Date'].astype(str).map(lambda x : x[:10])
apple_PER_PBR_ROE['Date'] = pd.to_datetime(apple_PER_PBR_ROE['Date'])
apple_PER_PBR_ROE.set_index(keys='Date', inplace=True)
apple_PER_PBR_ROE['sc_ap_roe'] = apple_PER_PBR_ROE['sc_ap_pbr'].astype(float) / apple_PER_PBR_ROE['sc_ap_per'].astype(float)

# Apple Market Capitalization
ticker = 'AAPL'
apple = yf.Ticker(ticker)
apple_data = apple.history(start=start_date, end=end_date)
apple_Market_Cap = apple.info['sharesOutstanding'] * apple_data['Close']
apple_Market_Cap = pd.DataFrame({'sc_ap_mc': apple_Market_Cap})
apple_Market_Cap = apple_Market_Cap.reset_index()
apple_Market_Cap['Date'] = apple_Market_Cap['Date'].astype(str).map(lambda x : x[:10])
apple_Market_Cap['Date'] = pd.to_datetime(apple_Market_Cap['Date'])
apple_Market_Cap.set_index(keys='Date', inplace=True)
apple_Market_Cap['sc_ap_mc'] = apple_Market_Cap['sc_ap_mc'].astype(str).map(lambda x : x+'000')

# Bit-Coin(BTC)
bitcoin_stock = fdr.DataReader('BTC/USD', fdr_start_year) 
bitcoin_stock.rename(columns={'Close' : 'sc_coin'}, inplace=True)
bitcoin_stock = bitcoin_stock['sc_coin']

# stock table insert
tb_stock_df_list = [samsung_stock, samsung_PER_PBR_ROE, samsung_Market_Cap,
                    apple_stock, apple_PER_PBR_ROE, apple_Market_Cap, 
                    bitcoin_stock]

stock_df = date_df.copy()
for i in range(len(tb_stock_df_list)) :
    stock_df = stock_df.join(tb_stock_df_list[i])

stock_df = stock_df.reset_index().rename(columns={'index' : 'fd_date'})
stock_df.fillna(method='ffill', inplace=True)
stock_df['fd_date'] = stock_df['fd_date'].astype(str).map(lambda x : x[:10])


# ************************************** tb_main_economic_index **************************************
# NASDAQ
nasdaq = fdr.DataReader('IXIC', fdr_start_year)
nasdaq.rename(columns = {'Close' : 'mei_nasdaq'}, inplace=True)
nasdaq = nasdaq['mei_nasdaq']

# S&P500
snp500 = fdr.DataReader('S&P500', fdr_start_year)
snp500.rename(columns = {'Close' : 'mei_sp500'}, inplace=True)
snp500 = snp500['mei_sp500']

# Dow
Dow = fdr.DataReader('DJI', fdr_start_year)
Dow.rename(columns = {'Close' : 'mei_dow'}, inplace=True)
Dow = Dow['mei_dow']

# KOSPI
kospi = fdr.DataReader('KS11', fdr_start_year)
kospi.rename(columns = {'Close' : 'mei_kospi'}, inplace=True)
kospi = kospi['mei_kospi']

# Gold, Oil
today_date = datetime.today()-timedelta(1)
days_passed = (today_date - start_date).days

# Gold
gold = yf.Ticker('GC=F')
gold_data = gold.history(period='max').tail(days_passed)
gold_data.rename(columns={'Close' : 'mei_gold'}, inplace=True)
gold_data = gold_data['mei_gold']
gold_data = gold_data.reset_index(drop=False)
gold_data['Date'] = gold_data['Date'].astype(str).map(lambda x : x[:10])
gold_data['Date'] = pd.to_datetime(gold_data['Date'])
gold_data.set_index(keys='Date', inplace=True)

# Oil
oil = yf.Ticker('BZ=F')
oil_data = oil.history(period='max').tail(days_passed)
oil_data.rename(columns={'Close' : 'mei_oil'}, inplace=True)
oil_data = oil_data['mei_oil']
oil_data = oil_data.reset_index(drop=False)
oil_data['Date'] = oil_data['Date'].astype(str).map(lambda x : x[:10])
oil_data['Date'] = pd.to_datetime(oil_data['Date'])
oil_data.set_index(keys='Date', inplace=True)

# Exchange Rate
dollar_to_won = fdr.DataReader('USD/KRW', fdr_start_year)
dollar_to_won.rename(columns={'Close' : 'mei_ex_rate'}, inplace=True)
dollar_to_won = dollar_to_won['mei_ex_rate']

# main economic index table insert
tb_main_economic_index_df_list = [nasdaq, snp500, Dow, kospi, gold_data, oil_data, dollar_to_won]

main_economic_index_df = date_df.copy()
for i in range(len(tb_main_economic_index_df_list)) :
    main_economic_index_df = main_economic_index_df.join(tb_main_economic_index_df_list[i])

main_economic_index_df = main_economic_index_df.reset_index().rename(columns={'index' : 'fd_date'})
main_economic_index_df.fillna(method='ffill', inplace=True)
main_economic_index_df['fd_date'] = main_economic_index_df['fd_date'].astype(str).map(lambda x : x[:10])


# ************************************** tb_korea_economic_indicator **************************************
data_name_ko = ['국내 총 생산',
            'M2 통화공급 (말잔)',
            'M2 통화공급 (평잔)',
            '중앙은행 기준금리',
            '생산자물가지수',
            '수입물가지수',
            '소비자물가지수',
            '수입',
            '수출',
            '소비자심리지수',
            '기업경기실사지수']

data_name = ['kei_gdp',
            'kei_m2_end',
            'kei_m2_avg',
            'kei_fed_rate',
            'kei_ppi',
            'kei_ipi',
            'kei_cpi',
            'kei_imp',
            'kei_exp',
            'kei_cs',
            'kei_bsi']

api_link = ['/200Y102/Q/2014Q1/2024Q2/10111',
            '/101Y007/M/201401/202406/BBIA00',
            '/101Y008/M/201401/202406/BBJA00',
            '/722Y001/M/201401/202406/0101000',
            '/404Y014/M/201401/202406/*AA',
            '/401Y015/M/201401/202406/*AA/W',
            '/901Y009/M/201401/202406/0',
            '/403Y003/M/201401/202406/*AA',
            '/403Y001/M/201401/202406/*AA',
            '/511Y002/M/201401/202406/FME/99988',
            '/512Y007/M/201401/202406/AA/99988']

all_data = []
all_time = []
for i in range(len(api_link)) :
    value_time = []
    value_data = []
    search_url = f'https://ecos.bok.or.kr/api/StatisticSearch/{ko_bank_key}/xml/kr/1/1{api_link[i]}'

    search_respons = requests.get(search_url)
    search_xml = search_respons.text
    search_soup = BeautifulSoup(search_xml, 'xml')
    total_val = search_soup.find('list_total_count')

    url = f'https://ecos.bok.or.kr/api/StatisticSearch/{ko_bank_key}/xml/kr/1/{total_val.text}{api_link[i]}'
    respons = requests.get(url)
    title_xml = respons.text
    title_soup = BeautifulSoup(title_xml, 'xml') 
    value_d = title_soup.find_all('DATA_VALUE')
    value_t = title_soup.find_all('TIME')
    for j in value_d : 
        value_data.append(j.text)
    for j in value_t :
        check_time = check_time_data(j.text)
        value_time.append(check_time)
    all_time.append(value_time)
    all_data.append(value_data)

all_time = [[convert_date_format(date) for date in row] for row in all_time]


# korea economic indicator table insert
korea_economic_indicator_df = date_df.copy()
for i in range(0, 11) :
    ko_eco_indi = pd.DataFrame({'Date' :  pd.to_datetime(all_time[i]), data_name[i] : all_data[i]}).set_index('Date')
    korea_economic_indicator_df = korea_economic_indicator_df.join(ko_eco_indi)
korea_economic_indicator_df = korea_economic_indicator_df.reset_index().rename(columns={'index' : 'fd_date'})

korea_economic_indicator_df.fillna(method='ffill', inplace=True)
korea_economic_indicator_df['fd_date'] = korea_economic_indicator_df['fd_date'].astype(str).map(lambda x : x[:10])


# ************************************** tb_us_economic_indicator **************************************
fred = Fred(api_key=fred_api_key)

indicators = {
    "uei_gdp": "GDP",
    "uei_fed_rate": "FEDFUNDS",
    "uei_ipi": "IR",
    "uei_ppi": "PPIACO",
    "uei_cpi": "CPIAUCSL",
    "uei_cpi_m": "CPIAUCNS",
    "uei_trade": "BOPGSTB",
    "uei_cb_cc": "CSCICP03USM665S",
    "uei_ps_m": "PCE",
    "uei_rs_m": "RSXFS",
    "uei_umich_cs": "UMCSENT"
}

us_economic_indicator_dic = {}
for name, series_id in indicators.items():
    try:
        us_economic_indicator_dic[name] = fred.get_series(series_id, observation_start=start_date, observation_end=end_date)
    except ValueError as e:
        print(f"Error fetching {name}: {e}")

us_economic_indicator_df = date_df.copy()
wei_dic = pd.DataFrame(us_economic_indicator_dic)
us_economic_indicator_df = us_economic_indicator_df.join(wei_dic)
us_economic_indicator_df = us_economic_indicator_df.reset_index().rename(columns={'index' : 'fd_date'})
us_economic_indicator_df.fillna(method='ffill', inplace=True)
us_economic_indicator_df['fd_date'] = us_economic_indicator_df['fd_date'].astype(str).map(lambda x : x[:10])




# tb_finance_date
date_df = date_df.reset_index().rename(columns={'index' : 'fd_date'})
date_df['fd_date'] = date_df['fd_date'].astype(str).map(lambda x : x[:10])

# Excel save
df_len.append(len(stock_df.dropna(axis=0)))
df_len.append(len(main_economic_index_df.dropna(axis=0)))
df_len.append(len(korea_economic_indicator_df.dropna(axis=0)))
df_len.append(len(us_economic_indicator_df.dropna(axis=0)))
df_len = min(df_len)



# Create DataFrames of user and finance
df_user_key = pd.DataFrame(tb_user_key_data)
df_user_information = pd.DataFrame(tb_user_information_data)
df_user_finance = pd.DataFrame(tb_user_finance_data)
df_chat_bot = pd.DataFrame(tb_chat_bot_data)
df_stock_predict = pd.DataFrame(tb_stock_predict_data)
df_shares_held = pd.DataFrame(tb_shares_held_data)
df_received_paid = pd.DataFrame(tb_received_paid_data)
df_news = pd.DataFrame(tb_news_data)
df_news_chat_room = pd.DataFrame(tb_news_chat_room_data)

# create dataframes of stock
df_finance_date = date_df.tail(df_len)
df_stock = stock_df.tail(df_len)
df_main_economic_index = main_economic_index_df.tail(df_len)
df_korea_economic_indicator = korea_economic_indicator_df.tail(df_len)
df_us_economic_indicator = us_economic_indicator_df.tail(df_len)

# 데이터베이스 테이블명 설정
database_tables_name = [
    'tb_user_key', # 0
    'tb_user_information', # 1
    'tb_user_finance', # 2
    'tb_chat_bot', # 3
    'tb_stock_predict', # 4
    'tb_finance_date', # 5
    'tb_stock', # 6
    'tb_korea_economic_indicator', # 7
    'tb_us_economic_indicator', # 8
    'tb_main_economic_index', # 9
    'tb_shares_held', # 10
    'tb_received_paid', # 11
    'tb_news', # 12
    'tb_news_chat_room', # 13
]

# 데이터프레임 순서 지정
all_tables_df = [
    df_user_key, df_user_information, df_user_finance, df_chat_bot, 
    df_stock_predict, df_finance_date, df_stock, df_korea_economic_indicator, 
    df_us_economic_indicator, df_main_economic_index, 
    df_shares_held, df_received_paid, df_news, df_news_chat_room
]


# 데이터베이스 연결
conn = pymysql.connect(
    host=database_host_ip,
    user=database_id,
    password=database_passwd,
    charset=database_charset
)

cur = conn.cursor()
print(f'========== DATABASE Connect ==========')

# 데이터베이스 생성
cur.execute(f"DROP DATABASE IF EXISTS {database_name}")
cur.execute(f"CREATE DATABASE {database_name}")
cur.execute(f"USE {database_name}")

# SQL 파일 실행
with open(sql_file_path, 'r', encoding='utf-8') as sql_file:
    sql_commands = sql_file.read().split(';')
    for command in sql_commands:
        if command.strip():
            cur.execute(command)

print(f'========== Insert query start! ==========')
table_num = 0
# tb_user_key
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_user_key (
            uk_email,
            uk_password,
            uk_permission
        ) VALUES (%s, %s, %s);
    """, (
        row['uk_email'],
        row['uk_password'],
        row['uk_permission'],
    ))

print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_user_information
print(f'========== {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_user_information (
            user_id,
            ui_name,
            ui_birth_date,
            ui_sex,
            ui_bank_num,
            ui_caution,
            ui_phone_number
        ) VALUES (%s, %s, %s, %s, %s, %s, %s);
    """, (
        row['user_id'],
        row['ui_name'],
        row['ui_birth_date'],
        row['ui_sex'],
        row['ui_bank_num'],
        row['ui_caution'],
        row['ui_phone_number']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_user_finance
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_user_finance (
            user_id,
            uf_capital,
            uf_loan,
            uf_installment_saving,
            uf_deposit,
            uf_target_budget
        ) VALUES (%s, %s, %s, %s, %s, %s);
    """, (
        row['user_id'],
        row['uf_capital'],
        row['uf_loan'],
        row['uf_installment_saving'],
        row['uf_deposit'],
        row['uf_target_budget']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_chat_bot
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_chat_bot (
            user_id,
            cb_date,
            cb_text
        ) VALUES (%s, %s, %s);
    """, (
        row['user_id'],
        row['cb_date'],
        row['cb_text']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_stock_predict
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_stock_predict (
            sp_date,
            sp_ss_predict,
            sp_ap_predict,
            sp_bit_predict
        ) VALUES (%s, %s, %s, %s);
    """, (
        row['sp_date'],
        row['sp_ss_predict'],
        row['sp_ap_predict'],
        row['sp_bit_predict']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_finance_date
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_finance_date (
            fd_date
        ) VALUES (%s);
    """, (
        row['fd_date']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_stock
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_stock (
            fd_date,
            sc_ss_stock,
            sc_ss_per,
            sc_ss_pbr,
            sc_ss_roe,
            sc_ss_mc,
            sc_ap_stock,
            sc_ap_per,
            sc_ap_pbr,
            sc_ap_roe,
            sc_ap_mc,
            sc_coin
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['fd_date'],
        row['sc_ss_stock'],
        row['sc_ss_per'],
        row['sc_ss_pbr'],
        row['sc_ss_roe'],
        row['sc_ss_mc'],
        row['sc_ap_stock'],
        row['sc_ap_per'],
        row['sc_ap_pbr'],
        row['sc_ap_roe'],
        row['sc_ap_mc'],
        row['sc_coin']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_korea_economic_indicator
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_korea_economic_indicator (
            fd_date,
            kei_gdp,
            kei_m2_end,
            kei_m2_avg,
            kei_fed_rate,
            kei_ppi,
            kei_ipi,
            kei_cpi,
            kei_imp,
            kei_exp,
            kei_cs,
            kei_bsi
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['fd_date'],
        row['kei_gdp'],
        row['kei_m2_end'],
        row['kei_m2_avg'],
        row['kei_fed_rate'],
        row['kei_ppi'],
        row['kei_ipi'],
        row['kei_cpi'],
        row['kei_imp'],
        row['kei_exp'],
        row['kei_cs'],
        row['kei_bsi']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_us_economic_indicator
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_us_economic_indicator (
            fd_date,
            uei_gdp,
            uei_fed_rate,
            uei_ipi,
            uei_ppi,
            uei_cpi,
            uei_cpi_m,
            uei_trade,
            uei_cb_cc,
            uei_ps_m,
            uei_rs_m,
            uei_umich_cs
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['fd_date'],
        row['uei_gdp'],
        row['uei_fed_rate'],
        row['uei_ipi'],
        row['uei_ppi'],
        row['uei_cpi'],
        row['uei_cpi_m'],
        row['uei_trade'],
        row['uei_cb_cc'],
        row['uei_ps_m'],
        row['uei_rs_m'],
        row['uei_umich_cs']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_main_economic_index
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_main_economic_index (
            fd_date,
            mei_nasdaq,
            mei_sp500,
            mei_dow,
            mei_kospi,
            mei_gold,
            mei_oil,
            mei_ex_rate
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['fd_date'],
        row['mei_nasdaq'],
        row['mei_sp500'],
        row['mei_dow'],
        row['mei_kospi'],
        row['mei_gold'],
        row['mei_oil'],
        row['mei_ex_rate']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_shares_held
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_shares_held (
            user_id,
            sc_id,
            sh_date,
            sh_ss_count,
            sh_ap_count,
            sh_bit_count
        ) VALUES (%s, %s, %s, %s, %s, %s);
    """, (
        row['user_id'],
        row['sc_id'],
        row['sh_date'],
        row['sh_ss_count'],
        row['sh_ap_count'],
        row['sh_bit_count']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_received_paid
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_received_paid (
            user_id,
            rp_date,
            rp_detail,
            rp_amount,
            rp_hold,
            rp_part
        ) VALUES (%s, %s, %s, %s, %s, %s);
    """, (
        row['user_id'],
        row['rp_date'],
        row['rp_detail'],
        row['rp_amount'],
        row['rp_hold'],
        row['rp_part']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_news
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_news (
            news_date,
            news_title,
            news_simple_text,
            news_link
        ) VALUES (%s, %s, %s, %s);
    """, (
        row['news_date'],
        row['news_title'],
        row['news_simple_text'],
        row['news_link']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1

# tb_news_chat_room
print(f'========== {table_num} {database_tables_name[table_num]} insert start ==========')
for index, row in all_tables_df[table_num].iterrows() :
    cur.execute("""
        INSERT INTO tb_news_chat_room (
            news_id,
            ncr_chat_message,
            ncr_timestamp
        ) VALUES (%s, %s, %s);
    """, (
        row['news_id'],
        row['ncr_chat_message'],
        row['ncr_timestamp']
    ))
print(f'========== {table_num} {database_tables_name[table_num]} insert end ==========')
table_num += 1


print('========== Insert Query End ==========')

conn.commit()
conn.close()
print('========== DATABASE Connect End ==========')