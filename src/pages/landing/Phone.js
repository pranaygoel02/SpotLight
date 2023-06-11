import React from 'react'
import Button from '../../components/Button'
import PhoneLogic from '../../Logic/UserLogic.js/Phone.logic'
import Input from '../../components/Input';

function Phone() {

    const { inputs, validateMessage, updatePhoneNumber, signingin, phoneCode } = PhoneLogic();



  return (
    <form onSubmit={updatePhoneNumber} className='w-full'>
        {
            inputs.map((input, index) => (
                <Input
                leftIcon={
                    <div className="flex flex-row items-center justify-center">
                      <p className="text-black border-r px-2 text-base border-neutral-300">
                        {phoneCode}
                      </p>
                    </div>
                  }
                  show={true}
                {...input}/>
            ))
        }
        <Button loading={signingin} type={'submit'} text='Update Phone Number' />
    </form>
  )
}

export default Phone