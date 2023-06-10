import React from 'react'
import Button from '../../components/Button'
import OtpLogic from '../../Logic/UserLogic.js/Otp.logic'
import Input from '../../components/Input';

function Otp() {

    const { inputs, validateMessage, updatePhoneVerificationStatus, signingin, timeString, phone, timeLeft, resendCode } = OtpLogic();

    console.log('====================================');
    console.log(inputs, validateMessage, updatePhoneVerificationStatus, signingin);
    console.log('====================================');

  return (
    <>
    <form onSubmit={updatePhoneVerificationStatus} className='w-full'>
        {
            inputs.map((input, index) => (
                <Input {...input}/>
            ))
        }
        <Button loading={signingin} type={'submit'} text='Update Phone Number' />
    </form>
    <p className='text-center font-bold text-base'>Time Left: {timeString}</p>
    {timeLeft <= 0 && <p className='text-center py-4'>Didn't receive the code? <button onClick={resendCode} className='text-blue-500'>Resend</button></p>}
    </>
  )
}

export default Otp