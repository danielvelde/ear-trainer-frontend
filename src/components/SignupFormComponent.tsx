import {useState} from "react";

function SignupFormComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');




    async function register(e: { preventDefault: () => void; }) {
        e.preventDefault();

        const registrationData = {
            email: email,
            password: password,
            defaultDifficulty: 0
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Success:", data);
                alert("Registration successful!");
            } else {
                const errorData = await response.json();
                console.error("Server Error:", errorData);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Could not connect to the backend.");
        }
    }

    return (

        <div>
            <form onSubmit={register}>
                <label>Email</label>
                <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required/><br/>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                onChange={(e) => setPassword(e.target.value)}
                required/><br/>
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default SignupFormComponent;