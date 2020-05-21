import React from 'react';
import MaskedInput from 'react-text-mask';


interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}
  
export default function PhoneMaskedInput(props: TextMaskCustomProps) {
    const { inputRef, ...other } = props;
    return (
        <MaskedInput
        {...other}
        ref={(ref: any) => {
            inputRef(ref ? ref.inputElement : null);
        }}
        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
        />
    );
}

export function unMaskPhone(phoneNumber:string) {
    return phoneNumber.slice(1, 4) + phoneNumber.slice(6, 9) + phoneNumber.slice(10)
}