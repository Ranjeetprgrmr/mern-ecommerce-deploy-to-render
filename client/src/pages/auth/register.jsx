import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/components/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


const initialState = {
    userName: '',
    email: '',
    password: ''
}


function AuthRegister(){

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    function onSubmit(event) { 
        console.log('hello');
        event.preventDefault();
        dispatch(registerUser(formData))
         .then((data)=>{
            console.log('this is data',data);
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message
                });
                navigate('/auth/login');
            }else {
                toast({
                    title: data.payload.message,
                    variant : 'destructive'
                })
            }
        });
    }
    

    return(
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
                <p>Already have an account?
                    <Link to='/auth/login' className="text-primary font-bold hover:underline ml-2">Login</Link>
                </p>
            </div>
            <CommonForm 
                formControls={registerFormControls}
                buttonText='Register'
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthRegister;