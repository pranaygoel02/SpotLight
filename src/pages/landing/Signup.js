import React from 'react'
import Button from '../../components/Button'
import SignupLogic from '../../Logic/UserLogic.js/Signup.logic'
import Input from '../../components/Input';

function Signup() {

    const { inputs, validateMessage, signUpUser, signingin, navigateToPhone } = SignupLogic();

    console.log('====================================');
    console.log(inputs, validateMessage, signUpUser, signingin);
    console.log('====================================');

  return (
    <form onSubmit={signUpUser} className='w-full'>
        {
            inputs.map((input, index) => (
                <Input {...input}/>
            ))
        }
        <Button loading={signingin} type={'submit'} text='Sign up' />
    </form>
  )
}

export default Signup