import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {

  const [apiResponse, setApiResponse] = useState(null); // State to store API response

  // useEffect to test the Flask backend
  useEffect(() => {
    // Replace '/api/test' with the actual Flask API endpoint you want to test
    fetch('/api/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setApiResponse(data); // Store the API response
        console.log('Flask API response:', data); // Log the response
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  
  return (
    <div className="home h-screen w-screen flex flex-col items-center justify-center bg-blue-500">
      <div className="text-center text-white mb-8">
        <h1 className="text-4xl font-bold mb-4">Book same-day appointments at SIT clinic</h1>
        <p className="text-lg mb-6">Lighting fast booking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <Link to="/vaccination" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
          <img 
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Vaccination" 
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Book an Appointments</h2>
          <p className="text-gray-600">Able to book appoiments with doctor</p>
        </Link>

        <Link to="/child-vaccination" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
          <img 
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Child Vaccination" 
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">View Bills</h2>
          <p className="text-gray-600">Get the vaccinations your child needs, free of charge</p>
        </Link>

        {/* Card 3 */}
        <Link to="/health-screening" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
          <img 
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Health Screening" 
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Book a Health Screening</h2>
          <p className="text-gray-600">Screen for Life and Mammogram screenings available</p>
        </Link>

        {/* Card 4 */}
        <Link to="/gp-consultation" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
          <img 
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="GP Consultation" 
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Book a GP Consultation</h2>
          <p className="text-gray-600">Same-day appointments are now available</p>
        </Link>

        {/* Card 5 */}
        <Link to="/services" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
          <img 
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Browse Services" 
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Browse all services</h2>
        </Link>
      </div>
    </div>
  );
}

export default Home;
