import React, { useState, useEffect }  from 'react';
import '../styles/NewsCheck.css';
import good_png from '../images/good_news_image.png'
import bad_png from '../images/bad_news_image.png'



function NewsCheckPage() {
  const [randomImages, setRandomImages] = useState([]);

  const getRandomImage = () => {
    const sampleImages = [good_png, bad_png];
    const randomIndex = Math.floor(Math.random() * sampleImages.length);
    return sampleImages[randomIndex];
  };
  
  useEffect(() => {
    const images = Array.from({ length: 5 }).map(() => getRandomImage());
    setRandomImages(images);
  }, []);

  // useEffect(() => { // GET
  //   fetch('http://localhost:5000/NewsCheckPage/News')
  //     .then((response) => response.json())
  //     .then((data) => setTodoList(data));
  // }, []);

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();
  //   const text = e.target.text.value;
  //   const done = e.target.done.checked;
  //   fetch('http://localhost:5000/NewsCheckPage/News', {
  //     method : "POST",
  //     headers : {
  //       'Content-Type' : 'application/json',
  //     },
  //     body : JSON.stringify({
  //       text,
  //       done,
  //     })
  //   })
  // };

  return (
    <div id="news-container">
      <div className="news-main-content">
        <h1>News Head</h1>
        <p>
          뉴스의 본문이 들어가는 공간
        </p>
        <div className='news-bottom'></div>
      </div>
      <div className="news-sidebar">
        <h2>News</h2>
        {randomImages.map((image, index) => (
          <div className="news-item" key={index}>
            <div className="news-desc-text">
              <h3>News head</h3>
              <p>Innovative Algorithm Boosts Speed and Accuracy, Bringing</p>
            </div>
            {image && <img src={image} alt={`news-${index}`} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsCheckPage;
