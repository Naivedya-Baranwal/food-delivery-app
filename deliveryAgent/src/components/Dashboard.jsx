import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getDashboard } from '../features/auth/authSlice';

const Dashboard = () => {
//   const dispatch = useDispatch();
//   const { dashboardData, agent } = useSelector(state => state.auth);

//   useEffect(() => {
//     dispatch(getDashboard());
//   }, [dispatch]);

//   if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Today's Deliveries</h3>
          <p className="text-3xl font-bold text-green-600">
            {/* {dashboardData.todayDeliveries} */}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Deliveries</h3>
          <p className="text-3xl font-bold text-blue-600">
            {/* {dashboardData.agent.totalDeliveries} */}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Current Status</h3>
         <div className="flex items-center space-x-4">
          {/* <div className={`w-4 h-4 rounded-full ${agent.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div> */}
          {/* <span>{agent.isAvailable ? 'Available' : 'Busy'}</span> */}
        </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Current Orders</h3>
        <div className="flex items-center space-x-4">
          {/* <div className={`w-4 h-4 rounded-full ${agent.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div> */}
          {/* <span>{agent.isAvailable ? 'Available' : 'Busy'}</span> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
