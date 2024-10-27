export const CONSTANTS={
    msgValidation:{
        name:"name should be a non-empty string",
        password:"password should be a non-empty string",
        email:"Please enter valid email",
        address:"address should be a non-empty string",
        role:"role should be a non-empty string",
        userExists:"user already exist",
        invalidCredentials:"Invalid credentials",
        oldEmail:"Please enter valid email",
        newEmail:"Please enter valid email",
        oldPassword:"password should be a non-empty string",
        newPassword:"password should be a non-empty string",
        type:"type should be a non-empty string",
        location:"location should be a non-empty string",
        ownerId:"ownerId should be a non-empty string",
        pricePerHead:"pricePerHead should be a valid number greater than 1",
        maxGroupSize:"maxGroupSize should be a valid number greater than 1",
        timeSlots:"Time slots should be a non-empty array",
        addtimeSlots:"Time slots should be a non-empty array",
        deltimeSlots:"Time slots should be a non-empty array"
    },
    dtoFields:{
        SignupDto:["name","email","address","role","password"],
        SignInDto:["email","password","role"],
        UpdateProfileDto:["oldEmail","newEmail","oldPassword","newPassword","address"],
        CreateFacilityDto:["name","type","location","ownerId","pricePerHead","maxGroupSize","timeSlots"],
        UpdateFacilityDto:["name","type","location","ownerId","pricePerHead","maxGroupSize","addtimeSlots","deltimeSlots"]
    },
    errorCodes:{
        11000:(key)=>{return `Field ${key} already exists`}
    }
}