const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {currentYear} SIP Calculator. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            This calculator is for illustrative purposes only. Please consult a financial advisor before making investment decisions.
          </p>
        </div>
      </footer>
    );
};
  
export default Footer;
  