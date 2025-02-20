// src/pages/LoginPage/LoginPage.template.tsx
import React from 'react';
import Login, { Logo } from '@react-login-page/base';
import { useLoginPage } from './LoginPage';
import styles from './LoginPage.module.css';

export default function LoginPageTemplate() {
  const { errorMessage, handleSubmit } = useLoginPage();

  return (
    <div className={styles.wrapper}>
      <Login
        onSubmit={handleSubmit}
        footer={
          <div className={styles.footer}>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <p>
              <a
                href="https://github.com/react-login-page"
                target="_blank"
                rel="noopener noreferrer"
              >
                @react-login-page/base
              </a>
            </p>
          </div>
        }
      >
        {/* This removes the default logo */}
        <Logo visible={false} />
      </Login>
    </div>
  );
}
