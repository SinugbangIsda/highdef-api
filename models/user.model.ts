import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email_address: {
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
            required: true
        }
    },
    { timestamps: true }
);

const User = mongoose.model('Users', userSchema);

export default User;
