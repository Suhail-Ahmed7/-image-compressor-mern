import React from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Image Compressor',
      description: 'Compress images without losing quality.',
      route: '/compress',
      label: 'ZIP',
    },
    {
      title: 'Image Resizer',
      description: 'Resize images to desired dimensions.',
      // route: '/resize',
      label: 'SIZE',
    },
    {
      title: 'Format Converter',
      description: 'Convert images to different formats.',
      route: '/convert',
      label: 'IMG',
    },
  ];

  return (
    <div className="home-container">
      <h2 className="home-title">Image Tools</h2>
      <div className="card-container">
        {tools.map((tool, index) => (
          <div className="card" key={index} onClick={() => navigate(tool.route)}>
            <div className="card__body">
              <h3 className="card__title">{tool.title}</h3>
              <p className="card__paragraph">{tool.description}</p>
            </div>
            <div className="card__ribbon">
              <span className="card__ribbon-label">{tool.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
