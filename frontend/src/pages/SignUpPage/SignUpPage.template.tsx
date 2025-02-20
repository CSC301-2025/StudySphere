// src/pages/SignUpPage/SignUpPage.template.tsx
import React from 'react';
import Login, { Title, Username, Password, Submit, Input, Footer, Logo } from '@react-login-page/base';
import { useSignUpPage } from './SignUpPage';
import styles from './SignUpPage.module.css';

export default function SignUpPageTemplate() {
  const { errorMessage, handleSignUp } = useSignUpPage();

  return (
    <div className={styles.wrapper}>
      <Login onSubmit={handleSignUp} >
        {/* Page title */}
        <Title>Sign Up</Title>

        {/* Hide the default username field (if you prefer custom fields) */}
        <Username visible={false} />

        {/* First Name */}
        <Input name="first_name" index={1} placeholder="First Name" />

        {/* Last Name */}
        <Input name="last_name" index={2} placeholder="Last Name" />

        {/* Email */}
        <Input name="email" index={3} placeholder="Email" />

        {/* Password (built-in) */}
        <Password index={4} placeholder="Password" />

        {/* Phone Number */}
        <Input name="phone" index={5} placeholder="Phone Number" />

        {/* University Dropdown */}
        <Input name="university" index={6}>
          <select style={{ width: '100%', height: '38px' }}>
            <option value="">Select University</option>
            <option value="MIT">MIT</option>
            <option value="Harvard">Harvard</option>
            <option value="Stanford">Stanford</option>
            {/* Add more as needed */}
          </select>
        </Input>

        {/* Submit Button */}
        <Submit>Sign Up</Submit>

        {/* Footer with error message */}
        <Footer>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </Footer>
        <Logo visible={false} />
      </Login>
    </div>
  );
}
