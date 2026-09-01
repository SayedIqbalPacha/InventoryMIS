function Button({ children }) {
  const className =
    "bg-yellow-400 focus:outline-none focus:ring focus:ring-red-400 focus:outline-offset-2 focus:w-70 transition-all duration-300 hover:bg-red-100 border-0 ";
/* eslint-disable */
  return  <div className="divide-y divide-amber-700">
    <button className={className}>{children}</button>
  </div>
}

export default Button;