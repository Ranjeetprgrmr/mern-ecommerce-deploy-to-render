import { Link } from "react-router-dom";
import { useState } from "react";
import CommonForm from "@/components/common/form";
import { LoginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/components/hooks/use-toast";

const initialState = { 
    email: '',
    password: ''
}


function AuthLogin(){
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function onSubmit (event) {
        event.preventDefault();
        dispatch(loginUser(formData)).then((data)=>{
            console.log(data);
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message
                })
            } else {
                toast({
                    title : data?.payload?.message,
                    variant : 'destructive',
                })
            }
        });
    }

    return(
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
                <p>Already have an account?
                    <Link to='/auth/register' className="text-primary font-bold hover:underline ml-2">Register</Link>
                </p>
            </div>
            <CommonForm 
                formControls={LoginFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText='log in'
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthLogin;