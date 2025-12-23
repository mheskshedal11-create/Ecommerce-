
const generateOtp = () => {
    const opt = Math.floor(Math.random() * 900000) + 100000
    return opt
}
export default generateOtp