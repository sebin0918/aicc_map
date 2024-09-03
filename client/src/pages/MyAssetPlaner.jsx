import React, { useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import "../styles/myAssetPlaner.css";
import householdButtonIcon from '../images/map_household_button_icon.png';
import samsungIcon from '../images/samsung_icon.png';
import appleIcon from '../images/apple_icon.png';
import bitcoinIcon from '../images/bitcoin_icon.png';
import totalIncomIcon from '../images/map_total_income_icon.png';
import returnEquityIcon from '../images/map_return_equity_icon.png';
import { Link } from "react-router-dom";

// PieChart 활성화된 섹터 모양을 렌더링하는 함수 
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 25) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 5} y={ey} textAnchor={textAnchor} fill="#ffffff">{`${value} won`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 5} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const MyAssetPlaner = () => {
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [totalAsset, setTotalAsset] = useState(0);
  const [budget, setBudget] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentBudget, setCurrentBudget] = useState("0"); 
  const [deposit, setDeposit] = useState(0); 
  const [installmentSaving, setInstallmentSaving] = useState(0); 
  const [userLoan, setUserLoan] = useState(0); 
  const [samsungStock, setSamsungStock] = useState({}); // 삼성 주식 정보를 상태로 관리
  const [appleStock, setAppleStock] = useState({}); // 애플 주식 정보를 상태로 관리
  const [coin, setCoin] = useState({}); // 비트코인 정보를 상태로 관리
  const [total, setTotal] = useState({}); // 전체 자산 요약 정보를 상태로 관리
  const [data1, setData1] = useState([
    { name: '전월 지출', value: 2500000 },
    { name: '목표 예산', value: 0 } 
  ]);
  
  const [data2, setData2] = useState([
    { name: '금월 지출', value: 1500000 },
    { name: '목표 예산', value: 0 }
  ]);

  const fetchTargetBudget = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/my-asset-planer/target');
      const data = await response.json();
      console.log(data); 
      if (response.ok && data.targetBudget) {
        setCurrentBudget(data.targetBudget.toLocaleString());
      } else {
        console.error('Failed to fetch target budget:', data.error || 'No targetBudget in response');
      }
    } catch (error) {
      console.error('Error fetching target budget:', error);
    }
  };

  const updateTargetBudget = async (newBudget) => {
    try {
      const response = await fetch('http://localhost:5000/api/my-asset-planer/target', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetBudget: newBudget }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentBudget(newBudget.toLocaleString());
      } else {
        console.error('Failed to update target budget:', data.error);
      }
    } catch (error) {
      console.error('Error updating target budget:', error);
    }
  };

  const fetchDeposit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/my-asset-planer/deposit');
      const data = await response.json();
      console.log("Deposit data : ", data); 
      if (response.ok && data.userDeposit) {
        setDeposit(data.userDeposit);
      } else {
        console.error('Failed to fetch user deposit:', data.error || 'No user deposit in response');
      }
    } catch (error) {
      console.error('Error fetching userdeposit:', error);
    }
  };

  const fetchInstallmentSaving = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/my-asset-planer/installmentsaving');
      const data = await response.json();
      console.log("Installment saving : ", data);
      if (response.ok && data.userInstallmentSaving) {
        setInstallmentSaving(data.userInstallmentSaving);
      } else {
        console.error('Failed to fetch user installment saving:', data.error || 'No user installment saving in response');
      }
    } catch (error) {
      console.error('Error fetching user installment saving:', error);
    }
  };

  const fetchLoan = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/my-asset-planer/loan');
      const data = await response.json();
      console.log("Loan data : ", data);
      if (response.ok && data.userLoan) {
        setUserLoan(data.userLoan);
      } else {
        console.error('Failed to fetch user loan:', data.error || 'No user loan in response');
      }
    } catch (error) {
      console.error('Error fetching user loan:', error);
    }
  };

  // 서버에서 사용자의 주식 및 사잔 정보를 가져오기
  const fetchUserStockInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/my-asset-planer/stock');
      const data = await response.json();
      if (response.ok) {
        setSamsungStock(data.samsung || {}); // 삼성 주식 정보를 상태에 저장
        setAppleStock(data.apple || {}); // 애플 주식 정보를 상태에 저장
        setCoin(data.coin || {}); // 비트코인 정보를 상태에 저장
        setTotal(data.total || {}); // 전체 자산 요약 정보를 상태에 저장
      } else {
        console.error('Failed to fetch asset info:', data.error || 'No data in response');
      }
    } catch (error) {
      console.error('Error fetching asset info:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/my-asset-planer/capital');
        const data = await response.json();
        if (response.ok && data.userCapital) {
          setTotalAsset(data.userCapital); // 사용자의 자산정보를 상태에 저장
        } else {
          console.error('Failed to fetch user capital:', data.error || 'No userCapital in response');
        }
      } catch (error) {
        console.error('Error fetching user capital:', error);
      }
    };
  
    const targetBudgetValue = parseInt(currentBudget.replace(/,/g, ''), 10) || 0;
  
    setData1([
      { name: '전월 지출', value: 2200000 },
      { name: '목표 예산', value: targetBudgetValue }
    ]);
  
    setData2([
      { name: '금월 지출', value: 1300000 },
      { name: '목표 예산', value: targetBudgetValue }
    ]);

    fetchData();
    fetchTargetBudget(); 
    fetchDeposit(); 
    fetchInstallmentSaving(); 
    fetchLoan();
    fetchUserStockInfo();
  }, [currentBudget]); // currentBudget이 변경될 때마다 실행

  useEffect(() => {
    // totalAsset 계산
    const calculatedTotalAsset = (totalAsset || 0) + (deposit || 0) + (installmentSaving || 0) - (userLoan || 0);
    setTotalAsset(calculatedTotalAsset); // 총 자산 상태 업데이트 
  }, [deposit, installmentSaving, userLoan]); // deposit, installmentSaving, userLoan이 변경될 때마다 실행

  // 값 포맷팅 함수
  const formatValue = (value) => {
    return value !== undefined && value !== null ? value.toLocaleString() : '0';
  };

  // 첫번째 원그래프 올릴때 핸들러 
  const onPieEnter1 = (data, index) => {
    setActiveIndex1(index);
  };

  // 두번째 원그래프 올릴때 핸들러 
  const onPieEnter2 = (data, index) => {
    setActiveIndex2(index);
  };

  const handleBudgetChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setBudget(value);
    }
  };

  const handleSaveBudget = () => {
    if (budget) {
      updateTargetBudget(parseInt(budget, 10))
        .then(() => {
          setCurrentBudget(budget);
          setBudget("");
          setIsEditing(false);
          alert("예산이 성공적으로 변경되었습니다!"); 
        })
        .catch((error) => {
          console.error("Failed to update budget on server:", error);
          alert("서버에 예산을 업데이트하는 데 문제가 발생했습니다.");
        });
    } else {
      alert("예산 금액을 입력해주세요.");
    }
  };
  

  const handleCancelEdit = () => {
    setBudget("");
    setIsEditing(false);
  };

  return (
    <div className="myassetplaner-dashboard">
      <section className="myassetplaner-summary">
        <div className="total-assets-box">
          <div className="total-assets">
          <h2>총 자산</h2>
            <button className="edit-budget-btn" onClick={() => setIsEditing(true)}>예산 설정</button>
            <p>
              {totalAsset !== null && deposit !== null && installmentSaving !== null && userLoan !== null
                ? `${(totalAsset + deposit + installmentSaving - userLoan).toLocaleString()} won`
                : '로딩 중...'}
            </p>
            <p>현재 수익 / 목표 예산</p>
            <p>
              {totalAsset !== null ? `${totalAsset.toLocaleString()} won` : '0,000,000 won'} / 
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={budget}
                    onChange={handleBudgetChange}
                    placeholder="목표 예산을 입력하세요."
                  />
                  <button onClick={handleSaveBudget} className="edit-budget-btn">수정 완료</button>
                  <button className="budget-cancel-btn"onClick={handleCancelEdit}>취소</button>
                </>
              ) : (
                <>
                  {currentBudget !== null ? `${currentBudget} won` : '로딩 중...'}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="progress-charts">
          <div className="progress-chart">
            <ResponsiveContainer width="200%" height={240}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex1}
                  activeShape={renderActiveShape}
                  data={data1}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter1}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="progress-label">전체 지출 평균</div>
          </div>
          <div className="progress-chart">
            <ResponsiveContainer width="200%" height={240}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex2}
                  activeShape={renderActiveShape}
                  data={data2}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                  onMouseEnter={onPieEnter2}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="progress-label">이달 사용 금액</div>
          </div>
        </div>
      </section>
      <section className="myassetplaner-content">
        <div className="left-column">
          <Link to="/household" className="ledger-header">
            <h2>가계부</h2>
            <img src={householdButtonIcon} alt="Household Button Icon" />
          </Link>
          <div className="budget">
            <h2>예적금</h2>
            <table className="budget-table">
              <thead className="budget-thead">
                <tr>
                  <th>Name</th>
                  <th>Fixed Deposit Month</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className="budget-tbody">
                <tr>
                  <td>정기 예금</td>
                  <td>-</td>
                  <td>{formatValue(deposit)}</td>
                </tr>
                <tr>
                  <td>적금</td>
                  <td>100,000</td>
                  <td>{formatValue(installmentSaving)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="loan">
            <h2>대출</h2>
            <table className="loan-table">
              <thead className="loan-thead">
                <tr>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Pay Back</th>
                </tr>
              </thead>
              <tbody className="loan-tbody">
                <tr>
                  <td>{formatValue(userLoan)}</td>
                  <td>3000</td>
                  <td>2000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="right-column">
          <div className="stock-summary">
            <div className="total-income">
            <span className="total-income-summary-label">Total Profit</span>
              <img src={totalIncomIcon} alt="Total Income Icon" />
              <p>{formatValue(total.totalProfit)} won</p>
            </div>
            <div className="return-of-equity">
            <span className="total-income-summary-label">Return of Equity</span>
              <img src={returnEquityIcon} alt="Return of Equity Icon" />
              <p>{total.totalROE !== undefined && total.totalROE !== null ? total.totalROE : '0.00'}%</p>
            </div>
          </div>
          <div className="stocks">
            <div className="stock-list-header">
              <h2>Stock List</h2>
              <input type="text" placeholder="Search for anything..." />
            </div>
            <table className="stock-table">
              <thead className="stock-thead">
                <tr>
                  <th>Name</th>
                  <th>Return of Equity</th>
                  <th>Total</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody className="stock-tbody">
                <tr>
                  <td className="stock-name">
                    <img src={samsungIcon} alt="Samsung Icon" />
                    <span>Samsung</span>
                  </td>
                  <td>{samsungStock.returnOfEquity !== undefined ? samsungStock.returnOfEquity : '0.00'}%</td>
                  <td>{formatValue(samsungStock.currentValue)} 원</td>
                  <td>{formatValue(samsungStock.amount)} 주</td>
                </tr>
                <tr>
                  <td className="stock-name">
                    <img src={appleIcon} alt="Apple Icon" />
                    <span>Apple</span>
                  </td>
                  <td>{appleStock.returnOfEquity !== undefined ? appleStock.returnOfEquity : '0.00'}%</td>
                  <td>{formatValue(appleStock.currentValue)} 원</td>
                  <td>{formatValue(appleStock.amount)} 주</td>
                </tr>
                <tr>
                  <td className="stock-name">
                    <img src={bitcoinIcon} alt="Bitcoin Icon" />
                    <span>Bitcoin</span>
                  </td>
                  <td>{coin.returnOfEquity !== undefined ? coin.returnOfEquity : '0.00'}%</td>
                  <td>{formatValue(coin.currentValue)} 원</td>
                  <td>{formatValue(coin.amount)} coin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAssetPlaner;
