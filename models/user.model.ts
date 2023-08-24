import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        emailAddress: {
            type: String,
            validate: {
                validator: (value: string) => {
                    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    return regex.test(value);
                },
                message: 'Invalid email address. Please enter a valid email.'
            },
            required: true
        },
        password: {
            type: String,
            minLength: 8,
            validate: {
                validator: (value: string) => {
                    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return regex.test(value);
                },
                message: 'Password must have a minimum length of 8 characters, at least 1 uppercase letter, and at least 1 special character.'
            },
            required: true
        }
    },
    { timestamps: true }
);

const User = mongoose.model('Users', userSchema);

export default User;
