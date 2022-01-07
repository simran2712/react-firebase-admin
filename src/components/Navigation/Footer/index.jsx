import React from 'react';
import classNames from 'classnames';

import classes from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className={classNames('level', classes.level)}>
          <div className="level-left">
            <div className="level-item">
              Scribe Portal NSS, forked from
              <a href="https://github.com/CreateThrive/react-firebase-admin">CreateThrive</a>
            </div>
          </div>
          <div className={classNames('level-right', classes.levelRight)}>
            <div className="level-item">
              <div className="logo">
                <a href="https://github.com/CreateThrive/react-firebase-admin">
                  <img
                    src="https://createthrive.com/assets/images/Logo-CT.svg"
                    alt="CreateThrive.com"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
