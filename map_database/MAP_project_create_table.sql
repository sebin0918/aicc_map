-- AICC_DB_MAP 데이터베이스가 없는 경우에만 생성
CREATE DATABASE IF NOT EXISTS aicc_db_map;
USE aicc_db_map;


-- 나머지 테이블 생성 명령어를 여기에 추가...
/* User */
CREATE TABLE tb_user
(
    user_id                 INT             NOT NULL AUTO_INCREMENT,
    user_email              VARCHAR(55)     NOT NULL UNIQUE,
    user_password           VARCHAR(100)    NOT NULL,
    user_name               VARCHAR(35)     NOT NULL,
    user_birth_date         DATE            NOT NULL,
    user_sex                BOOL            NOT NULL,
    user_permission         BOOL            NOT NULL,
    user_bank_num           VARCHAR(100),
    user_capital            INT,
    user_loan               INT,
    user_installment_saving INT,
    user_deposit            INT,
    user_target_budget      INT,
    PRIMARY KEY (user_id)
);

/* Chat bot */
CREATE TABLE tb_chat_bot
(
    cb_id                   INT             NOT NULL AUTO_INCREMENT,
    cb_date                 DATE,
    cb_text                 TEXT,
    PRIMARY KEY (cb_id)
);

CREATE TABLE tb_user_chat_bot  /* connect */
(
    user_id                 INT             NOT NULL,
    cb_id                   INT             NOT NULL,
    PRIMARY KEY (user_id, cb_id),
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id),
    FOREIGN KEY (cb_id) REFERENCES tb_chat_bot(cb_id)
);

/* Korea Economic Indicator */
CREATE TABLE tb_korea_economic_indicator
(
    kei_id                  INT             NOT NULL AUTO_INCREMENT,
    kei_date                DATE            NOT NULL,
    kei_gdp                 FLOAT           NOT NULL,
    kei_m2_end              FLOAT           NOT NULL,
    kei_m2_avg              FLOAT           NOT NULL,
    kei_fed_rate            FLOAT           NOT NULL,
    kei_ppi                 FLOAT           NOT NULL,
    kei_ipi                 FLOAT           NOT NULL,
    kei_cpi                 FLOAT           NOT NULL,
    kei_imp                 FLOAT           NOT NULL,
    kei_exp                 FLOAT           NOT NULL,
    kei_ca                  FLOAT           NOT NULL,
    kei_cs                  FLOAT           NOT NULL,
    kei_bsi                 FLOAT           NOT NULL,
    kei_fr                  FLOAT           NOT NULL,
    PRIMARY KEY (kei_id)
);

/* US Economic Indicator */
CREATE TABLE tb_us_economic_indicator
(
    uei_id                  INT             NOT NULL AUTO_INCREMENT,
    uei_date                DATE            NOT NULL,
    uei_gdp                 FLOAT           NOT NULL,
    uei_fed_rate            FLOAT           NOT NULL,
    uei_ipi                 FLOAT           NOT NULL,
    uei_ppi                 FLOAT           NOT NULL,
    uei_cpi                 FLOAT           NOT NULL,
    uei_cpi_m               FLOAT           NOT NULL,
    uei_trade               FLOAT           NOT NULL,
    uei_cb_cc               FLOAT           NOT NULL,
    uei_ps_m                FLOAT           NOT NULL,
    uei_rs_m                FLOAT           NOT NULL,
    uei_umich_cs            FLOAT           NOT NULL,
    PRIMARY KEY (uei_id)
);

/* Main Economic Index */
CREATE TABLE tb_main_economic_index
(
    mei_id                  INT             NOT NULL AUTO_INCREMENT,
    mei_date                DATE            NOT NULL,
    mei_nasdaq              FLOAT           NOT NULL,
    mei_sp500               FLOAT           NOT NULL,
    mei_dow                 FLOAT           NOT NULL,
    mei_kospi               FLOAT           NOT NULL,
    mei_gold                FLOAT           NOT NULL,
    mei_oil                 FLOAT           NOT NULL,
    mei_ex_rate             FLOAT           NOT NULL,
    PRIMARY KEY (mei_id)
);

/* Stock */
CREATE TABLE tb_stock
(
    sc_id                   INT             NOT NULL AUTO_INCREMENT,
    sc_date                 DATE            NOT NULL,
    sc_ss_stock             FLOAT           NOT NULL,
    sc_ss_per               FLOAT           NOT NULL,
    sc_ss_pbr               FLOAT           NOT NULL,
    sc_ss_roe               FLOAT           NOT NULL,
    sc_ss_mc                FLOAT           NOT NULL,
    sc_ap_stock             FLOAT           NOT NULL,
    sc_ap_per               FLOAT           NOT NULL,
    sc_ap_pbr               FLOAT           NOT NULL,
    sc_ap_roe               FLOAT           NOT NULL,
    sc_ap_mc                FLOAT           NOT NULL,
    sc_coin                 FLOAT           NOT NULL,
    PRIMARY KEY (sc_id)
);

CREATE TABLE tb_stock_predict
(
    sp_id                   INT             NOT NULL AUTO_INCREMENT,
    sp_date                 DATE            NOT NULL,
    sp_ss_predict           FLOAT           NOT NULL,
    sp_ap_predict           FLOAT           NOT NULL,
    sp_bit_predict          FLOAT           NOT NULL,
    PRIMARY KEY (sp_id)
);

/* Shares Held */
CREATE TABLE tb_shares_held
(
    sh_id                   INT             NOT NULL AUTO_INCREMENT,
    sc_id                   INT             NOT NULL,
    sh_date                 DATE            NOT NULL,
    sh_ss_count             INT,
    sh_ap_count             INT,
    sh_bit_count            INT,
    PRIMARY KEY (sh_id),
    FOREIGN KEY (sc_id) REFERENCES tb_stock(sc_id)
);

CREATE TABLE tb_user_shares_held  /* connect */
(
    user_id                 INT             NOT NULL,
    sh_id                   INT             NOT NULL,
    PRIMARY KEY (user_id, sh_id),
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id),
    FOREIGN KEY (sh_id) REFERENCES tb_shares_held(sh_id)
);

/* Received Paid */
CREATE TABLE tb_received_paid
(
    rp_id                   INT             NOT NULL AUTO_INCREMENT,
    rp_date                 DATE            NOT NULL,
    rp_detail               VARCHAR(100)    NOT NULL,
    rp_amount               INT             NOT NULL,
    rp_hold                 BOOL            NOT NULL,
    rp_part                 BOOL            NOT NULL,
    PRIMARY KEY (rp_id)
);

CREATE TABLE tb_user_received_paid  /* connect */
(
    user_id                 INT             NOT NULL,
    rp_id                   INT             NOT NULL,
    PRIMARY KEY (user_id, rp_id),
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id),
    FOREIGN KEY (rp_id) REFERENCES tb_received_paid(rp_id)
);

/* News */
CREATE TABLE tb_news
(
    news_id                 INT             NOT NULL AUTO_INCREMENT,
    news_date               DATE            NOT NULL,
    news_title              VARCHAR(100)    NOT NULL,
    news_simple_text        LONGTEXT        NOT NULL,
    news_link               TEXT            NOT NULL,
    PRIMARY KEY (news_id)
);

CREATE TABLE tb_news_chat_room
(
    ncr_id                  INT             NOT NULL AUTO_INCREMENT,
    news_id                 INT             NOT NULL,
    ncr_chat_message        TEXT,
    ncr_timestamp           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ncr_id),
    FOREIGN KEY (news_id) REFERENCES tb_news(news_id)
);

/* FAQ */
CREATE TABLE tb_faq
(
    faq_id                  INT             NOT NULL AUTO_INCREMENT,
    faq_type                TEXT            NOT NULL,
    faq_ask                 TEXT            NOT NULL,
    faq_answer              LONGTEXT        NOT NULL,
    PRIMARY KEY (faq_id)
);

/* Root User Creation/Modification */
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root1234';
ALTER USER 'root'@'%' IDENTIFIED BY 'root1234';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

SET GLOBAL innodb_lock_wait_timeout = 1000;

SHOW TABLES;