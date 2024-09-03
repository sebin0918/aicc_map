import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/HouseHold.css'

const events = [
  { date: '2024-08-01', type: '입금', amount: 3000, className: 'household-amount-plus' },
  { date: '2024-08-01', type: '출금', amount: 500, className: 'household-amount-minus'  },
  { date: '2024-08-02', type: '입금', amount: 1500, className: 'household-amount-plus' },
  { date: '2024-08-02', type: '출금', amount: 700, className: 'household-amount-minus' },
  // 더 많은 이벤트 추가
].map(event => ({
  ...event,
  title: `${event.type === '입금' ? '+' : '-'} $${event.amount}`
}));

const HouseHold = () => {
  const calendarRef = useRef(null);

  const calculateTotals = (dateStr) => {
    const dayEvents = events.filter(event => event.date === dateStr);
    const totalIncome = dayEvents.filter(e => e.type === '입금').reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = dayEvents.filter(e => e.type === '출금').reduce((sum, e) => sum + e.amount, 0);

    return { totalIncome, totalExpense, dayEvents };
  };

  const renderDayCellContent = (dateStr) => {
    const { totalIncome, totalExpense } = calculateTotals(dateStr);

    return (
      <div>
        <div>입금 총합: ${totalIncome}</div>
        <div>출금 총합: ${totalExpense}</div>
      </div>
    );
  };

  const renderWeekCellContent = (dateStr) => {
    const { totalIncome, totalExpense, dayEvents } = calculateTotals(dateStr);
    const displayedEvents = dayEvents.slice(0, 3);

    return (
      <div>
        <div>입금 총합: ${totalIncome}</div>
        <div>출금 총합: ${totalExpense}</div>
        {displayedEvents.map((e, idx) => (
          <div key={idx}>{e.title}</div>
        ))}
      </div>
    );
  };

  const renderDayEvents = (dateStr) => {
    const { totalIncome, totalExpense, dayEvents } = calculateTotals(dateStr);

    return (
      <div>
        <div>입금 총합: ${totalIncome}</div>
        <div>출금 총합: ${totalExpense}</div>
        {dayEvents.map((e, idx) => (
          <div key={idx}>{e.title}</div>
        ))}
      </div>
    );
  };

  const handleDatesSet = (info) => {
    const view = info.view;
    const { start, end } = view;
    let date = new Date(start);

    while (date <= end) {
      const dateStr = date.toISOString().split('T')[0];
      const cell = view.el.querySelector(`[data-date="${dateStr}"]`);

      if (cell) {
        let content;
        if (view.type === 'dayGridMonth') {
          content = renderDayCellContent(dateStr);
        } else if (view.type === 'dayGridWeek') {
          content = renderWeekCellContent(dateStr);
        } else if (view.type === 'dayGridDay') {
          content = renderDayEvents(dateStr);
        }

        if (content) {
          const container = document.createElement('div');
          ReactDOM.render(content, container);
          cell.querySelector('.fc-daygrid-day-top').appendChild(container);
        }
      }

      date.setDate(date.getDate() + 1);
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      handleDatesSet({ view: calendarApi.view });
    }
  }, []);

  return (
    <div className='household'>
      <div className='household-body'>
        <div className='household-header'>
          <h1>가계부</h1>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            datesSet={handleDatesSet}
            headerToolbar={{
              left: 'dayGridMonth,dayGridWeek,dayGridDay today prev,next',
              center: '',
              right: 'title'
            }}
            views={{
              dayGridMonth: {},
              dayGridWeek: {},
              dayGridDay: {},
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HouseHold;
