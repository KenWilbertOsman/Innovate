export default function loginValidate(values){
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }  
    
    //validation for password
    //can add different condition for the password input
    if (!values.password){
        errors.password = "Required"
    } else if(values.password.length <8){
        errors.password = "Must be Greater Than 8 Characters"
    } else if(values.password.includes(" ")){
        errors.password = "Invalid Password"
    }

    return errors;
}


export function registerValidate(values){
    const errors = {}

    if (!values.username){
        errors.username = "Required"
    }else if (values.username.includes(" ")){
        errors.username = "Invalid Username"
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }  
    
    //validation for password
    //can add different condition for the password input
    if (!values.password){
        errors.password = "Required"
    } else if(values.password.length <8){
        errors.password = "Must be Greater Than 8 Characters"
    } else if(values.password.includes(" ")){
        errors.password = "Invalid Password"
    }

    //validate confirm password
    if (!values.cpassword){
        errors.cpassword = "Required"
    } else if (values.password !== values.cpassword)
    {
        errors.cpassword = "Password does not match"
    } 
    
    return errors
}