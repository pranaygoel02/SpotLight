import React from 'react'
import LoginLogic from '../../Logic/UserLogic.js/Login.logic';
import Input from '../../components/Input';
import Button from '../../components/Button';

function Login() {
  const { inputs, validateMessage, loginUser, signingin } = LoginLogic();

    
    
    

  return (
    <form onSubmit={loginUser} className='w-full'>
        {
            inputs.map((input, index) => (
                <Input {...input} show={true}/>
            ))
        }
        <Button loading={signingin} type={'submit'} text='Sign in' />
    </form>
  )
}

export default Login