import sys
import pandas as pd
import pymysql as pms
print('Python version check : ', sys.version)
print('Pandas version check : ', pd.__version__)
print('PyMySQL version check : ', pms.__version__)

import pandas as pd

data_file_path = './datas'
database_tables_name = [
    'tb_user', # 0
    'tb_chat_bot', # 1
    'tb_user_chat_bot', # 2
    'tb_stock', # 3
    'tb_stock_predict', # 4
    'tb_shares_held', # 5
    'tb_user_shares_held', # 6
    'tb_korea_economic_indicator', # 7
    'tb_us_economic_indicator', # 8
    'tb_main_economic_index', # 9
    'tb_received_paid', # 10
    'tb_user_received_paid', # 11
    'tb_news', # 12
    'tb_news_chat_room', # 13
    'tb_faq' # 14
]

# Load data from Excel files
df_user = pd.read_excel(f'{data_file_path}/{database_tables_name[0]}.xlsx')
df_chat_bot = pd.read_excel(f'{data_file_path}/{database_tables_name[1]}.xlsx')
df_user_chat_bot = pd.read_excel(f'{data_file_path}/{database_tables_name[2]}.xlsx')
df_stock = pd.read_excel(f'{data_file_path}/{database_tables_name[3]}.xlsx')
df_stock_predict = pd.read_excel(f'{data_file_path}/{database_tables_name[4]}.xlsx')
df_shares_held = pd.read_excel(f'{data_file_path}/{database_tables_name[5]}.xlsx')
df_user_shares_held = pd.read_excel(f'{data_file_path}/{database_tables_name[6]}.xlsx')
df_korea_economic_indicator = pd.read_excel(f'{data_file_path}/{database_tables_name[7]}.xlsx')
df_us_economic_indicator = pd.read_excel(f'{data_file_path}/{database_tables_name[8]}.xlsx')
df_main_economic_index = pd.read_excel(f'{data_file_path}/{database_tables_name[9]}.xlsx')
df_received_paid = pd.read_excel(f'{data_file_path}/{database_tables_name[10]}.xlsx')
df_user_received_paid = pd.read_excel(f'{data_file_path}/{database_tables_name[11]}.xlsx')
df_news = pd.read_excel(f'{data_file_path}/{database_tables_name[12]}.xlsx')
df_news_chat_room = pd.read_excel(f'{data_file_path}/{database_tables_name[13]}.xlsx')
df_faq = pd.read_excel(f'{data_file_path}/{database_tables_name[14]}.xlsx')

all_tables_df = [
    df_user, df_chat_bot, df_user_chat_bot, df_stock, df_stock_predict,
    df_shares_held, df_user_shares_held, df_korea_economic_indicator,
    df_us_economic_indicator, df_main_economic_index, df_received_paid,
    df_user_received_paid, df_news, df_news_chat_room, df_faq
]

import pymysql

sql_file_path = './MAP_project_create_table.sql'
database_host_ip = 'database'
database_name = 'AICC_DB_MAP'
database_id = 'root'
database_passwd = 'root1234'
database_charset = 'utf8'


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
# cur.execute(f"DROP DATABASE IF EXISTS {database_name}")
# cur.execute(f"CREATE DATABASE {database_name}")
# cur.execute(f"USE {database_name}")

# AICC_DB_MAP 데이터베이스만 초기화 (mysql 데이터베이스는 건드리지 않음)
cur.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
cur.execute(f"USE {database_name}")

# # SQL 파일 실행
# with open(sql_file_path, 'r', encoding='utf-8') as sql_file:
#     sql_commands = sql_file.read().split(';')
#     for command in sql_commands:
#         if command.strip():
#             cur.execute(command)

# print(f'========== Insert query start! ==========')

# SQL 파일 실행
sql_file_path = './MAP_project_create_table.sql'
with open(sql_file_path, 'r', encoding='utf-8') as sql_file:
    sql_commands = sql_file.read().split(';')
    for command in sql_commands:
        if command.strip():
            print(f'Executing SQL command: {command}')  # 디버깅용 출력 추가
            cur.execute(command)

print(f'========== Insert query start! ==========')

# tb_user
print(f'========== {database_tables_name[0]} insert start ==========')
for index, row in all_tables_df[0].iterrows() :
    cur.execute("""
        INSERT INTO tb_user (
            user_email,
            user_password,
            user_name,
            user_birth_date,
            user_sex,
            user_permission,
            user_bank_num,
            user_capital,
            user_loan,
            user_installment_saving,
            user_deposit,
            user_target_budget
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['user_email'],
        row['user_password'],
        row['user_name'],
        row['user_birth_date'],
        row['user_sex'],
        row['user_permission'],
        row['user_bank_num'],
        row['user_capital'],
        row['user_loan'],
        row['user_installment_saving'],
        row['user_deposit'],
        row['user_target_budget']
    ))

print(f'========== {database_tables_name[0]} insert end ==========')

# tb_chat_bot
print(f'========== {database_tables_name[1]} insert start ==========')
for index, row in all_tables_df[1].iterrows() :
    cur.execute("""
        INSERT INTO tb_chat_bot (
            cb_date,
            cb_text
        ) VALUES (%s, %s);
    """, (
        row['cb_date'],
        row['cb_text']
    ))
print(f'========== {database_tables_name[1]} insert end ==========')

# tb_user_chat_bot
print(f'========== {database_tables_name[2]} insert start ==========')
for index, row in all_tables_df[2].iterrows() :
    cur.execute("""
        INSERT INTO tb_user_chat_bot (
            user_id,
            cb_id
        ) VALUES (%s, %s);
    """, (
        row['user_id'],
        row['cb_id']
    ))
print(f'========== {database_tables_name[2]} insert end ==========')

# tb_stock
print(f'========== {database_tables_name[3]} insert start ==========')
for index, row in all_tables_df[3].iterrows() :
    cur.execute("""
        INSERT INTO tb_stock (
            sc_date,
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
        row['sc_date'],
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
print(f'========== {database_tables_name[3]} insert end ==========')

# tb_stock_predict
print(f'========== {database_tables_name[4]} insert start ==========')
for index, row in all_tables_df[4].iterrows() :
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
print(f'========== {database_tables_name[4]} insert end ==========')

# tb_shares_held
print(f'========== {database_tables_name[5]} insert start ==========')
for index, row in all_tables_df[5].iterrows() :
    cur.execute("""
        INSERT INTO tb_shares_held (
            sc_id,
            sh_date,
            sh_ss_count,
            sh_ap_count,
            sh_bit_count
        ) VALUES (%s, %s, %s, %s, %s);
    """, (
        row['sc_id'],
        row['sh_date'],
        row['sh_ss_count'],
        row['sh_ap_count'],
        row['sh_bit_count']
    ))
print(f'========== {database_tables_name[5]} insert end ==========')

# tb_user_shares_held
print(f'========== {database_tables_name[6]} insert start ==========')
for index, row in all_tables_df[6].iterrows() :
    cur.execute("""
        INSERT INTO tb_user_shares_held (
            user_id,
            sh_id
        ) VALUES (%s, %s);
    """, (
        row['user_id'],
        row['sh_id']
    ))
print(f'========== {database_tables_name[6]} insert end ==========')

# tb_korea_economic_indicator
print(f'========== {database_tables_name[7]} insert start ==========')
for index, row in all_tables_df[7].iterrows() :
    cur.execute("""
        INSERT INTO tb_korea_economic_indicator (
            kei_date,
            kei_gdp,
            kei_m2_end,
            kei_m2_avg,
            kei_fed_rate,
            kei_ppi,
            kei_ipi,
            kei_cpi,
            kei_imp,
            kei_exp,
            kei_ca,
            kei_cs,
            kei_bsi,
            kei_fr
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['kei_date'],
        row['kei_gdp'],
        row['kei_m2_end'],
        row['kei_m2_avg'],
        row['kei_fed_rate'],
        row['kei_ppi'],
        row['kei_ipi'],
        row['kei_cpi'],
        row['kei_imp'],
        row['kei_exp'],
        row['kei_ca'],
        row['kei_cs'],
        row['kei_bsi'],
        row['kei_fr']
    ))
print(f'========== {database_tables_name[7]} insert end ==========')

# tb_us_economic_indicator
print(f'========== {database_tables_name[8]} insert start ==========')
for index, row in all_tables_df[8].iterrows() :
    cur.execute("""
        INSERT INTO tb_us_economic_indicator (
            uei_date,
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
        row['uei_date'],
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
print(f'========== {database_tables_name[8]} insert end ==========')

# tb_main_economic_index
print(f'========== {database_tables_name[9]} insert start ==========')
for index, row in all_tables_df[9].iterrows() :
    cur.execute("""
        INSERT INTO tb_main_economic_index (
            mei_date,
            mei_nasdaq,
            mei_sp500,
            mei_dow,
            mei_kospi,
            mei_gold,
            mei_oil,
            mei_ex_rate
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        row['mei_date'],
        row['mei_nasdaq'],
        row['mei_sp500'],
        row['mei_dow'],
        row['mei_kospi'],
        row['mei_gold'],
        row['mei_oil'],
        row['mei_ex_rate']
    ))
print(f'========== {database_tables_name[9]} insert end ==========')

# tb_received_paid
print(f'========== {database_tables_name[10]} insert start ==========')
for index, row in all_tables_df[10].iterrows() :
    cur.execute("""
        INSERT INTO tb_received_paid (
            rp_date,
            rp_detail,
            rp_amount,
            rp_hold,
            rp_part
        ) VALUES (%s, %s, %s, %s, %s);
    """, (
        row['rp_date'],
        row['rp_detail'],
        row['rp_amount'],
        row['rp_hold'],
        row['rp_part']
    ))
print(f'========== {database_tables_name[10]} insert end ==========')

# tb_user_received_paid
print(f'========== {database_tables_name[11]} insert start ==========')
for index, row in all_tables_df[11].iterrows() :
    cur.execute("""
        INSERT INTO tb_user_received_paid (
            user_id,
            rp_id
        ) VALUES (%s, %s);
    """, (
        row['user_id'],
        row['rp_id']
    ))
print(f'========== {database_tables_name[11]} insert end ==========')

# tb_news
print(f'========== {database_tables_name[12]} insert start ==========')
for index, row in all_tables_df[12].iterrows() :
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
print(f'========== {database_tables_name[12]} insert end ==========')

# tb_news_chat_room
print(f'========== {database_tables_name[13]} insert start ==========')
for index, row in all_tables_df[13].iterrows() :
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
print(f'========== {database_tables_name[13]} insert end ==========')

# tb_faq
print(f'========== {database_tables_name[14]} insert start ==========')
for index, row in all_tables_df[14].iterrows() :
    cur.execute("""
        INSERT INTO tb_faq (
            faq_type,
            faq_ask,
            faq_answer
        ) VALUES (%s, %s, %s);
    """, (
        row['faq_type'],
        row['faq_ask'],
        row['faq_answer']
    ))
print(f'========== {database_tables_name[14]} insert end ==========')

print('========== Insert Query End ==========')

conn.commit()
conn.close()
print('========== DATABASE Connect End ==========')

