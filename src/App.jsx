import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Layout from './components/Layout/Layout'
import Login from './components/Login/Login'
import ForgetPassword from './components/ForgetPassword/ForgetPassword'
import UpdatePassword from './components/UpdatePassword/UpdatePassword'
import Products from './components/Products/products'
import Contact from './components/Contact/Contact'
import Articles from './components/Articles/Articles'
import NutritionArticles from './components/Articles/NutritionArticles'
import MovementArticles from './components/Articles/MovementArticles'
import RecoveryArticles from './components/Articles/RecoveryArticles'
import MindsetArticles from './components/Articles/MindsetArticles'
import ArticleDetails from './components/Articles/ArticleDetails'
import ProtectedRouting from './components/ProtectedRouting/ProtectedRouting'
import { AuthContextProvider } from './components/Context/AuthContextProvider'
import Trainers from './components/Trainers/Trainers'
import FitnessTrainers from './components/Trainers/FitnessTrainers'
import NutritionistTrainers from './components/Trainers/NutritionistTrainers'
import TrainerDetails from './components/Trainers/TrainerDetails'
import CartContextProvider from './components/Context/CartContextProvider'
import ProfileRouter from './components/Profile/ProfileRouter'
import Cart from './components/Cart/Cart'
import Orders from './components/Orders/Orders'
import Notifications from './components/Notification/Notifications'
import NotificationContextProvider from './components/Context/NotificationContextProvider'
import Transformation from './components/Transformation/Transformation'
import BundleBooking from './components/BundleBooking/BundleBooking'
import BundleManagement from './components/Bundles/BundleManagement'
import TIB from './components/TIB/TIB'
import Payment from './components/Orders/Payment'
import Pay from './components/Orders/Pay'
// import TIA from './components/TIA/TIA'

export default function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'Products', element: <ProtectedRouting><Products /></ProtectedRouting> },
        { path: 'Cart', element: <ProtectedRouting><Cart /></ProtectedRouting> },
        { path: 'Contact', element: <ProtectedRouting><Contact/></ProtectedRouting> },
        { path: 'Articles', element: <ProtectedRouting><Articles /></ProtectedRouting> },
        { path: 'Articles/nutrition', element: <ProtectedRouting><NutritionArticles /></ProtectedRouting> },
        { path: 'Articles/movement', element: <ProtectedRouting><MovementArticles /></ProtectedRouting> },
        { path: 'Articles/recovery', element: <ProtectedRouting><RecoveryArticles /></ProtectedRouting> },
        { path: 'Articles/mindset', element: <ProtectedRouting><MindsetArticles /></ProtectedRouting> },
        { path: 'Article/:id', element: <ProtectedRouting><ArticleDetails /></ProtectedRouting> },
        { path: 'trainers', element: <ProtectedRouting><Trainers /></ProtectedRouting> },
        { path: 'trainer-details/:id', element: <ProtectedRouting><TrainerDetails /></ProtectedRouting> },
        { path: 'trainers/fitness', element: <ProtectedRouting><FitnessTrainers /></ProtectedRouting> },
        { path: 'trainers/nutrition', element: <ProtectedRouting><NutritionistTrainers /></ProtectedRouting> },
        { path: 'trainers/:id', element: <ProtectedRouting><TrainerDetails /></ProtectedRouting> },
        { path: 'Orders', element: <ProtectedRouting><Orders /></ProtectedRouting> },
        { path: 'Notifications', element: <ProtectedRouting><Notifications /></ProtectedRouting> },
        { path: 'bundle/:bundleId/book', element: <ProtectedRouting><BundleBooking /></ProtectedRouting> },
        { path: 'manage-bundles', element: <ProtectedRouting><BundleManagement /></ProtectedRouting> },
        { path: 'transformation/:id', element: <ProtectedRouting><Transformation /></ProtectedRouting> },
        { path: 'TIB', element: <ProtectedRouting><TIB/></ProtectedRouting> },
        { path: 'Pay', element: <ProtectedRouting><Pay/></ProtectedRouting> },

        { path: 'Payment', element: <ProtectedRouting><Payment/></ProtectedRouting> },

        // { path: 'TIA', element: <ProtectedRouting><TIA/></ProtectedRouting> },

        // { path: 'Shop', element: <ProtectedRouting><Shop /></ProtectedRouting> },
        { path: 'profile', element: <ProtectedRouting><ProfileRouter /></ProtectedRouting> },
        { path: 'Register', element: <Register /> },
        { path: 'Login', element: <Login /> },
        { path: "ForgetPassword", element: <ForgetPassword /> },
        { path: "UpdatePassword", element: <UpdatePassword /> },
        {
          path: '*',
          element: (
            <div className='bg-gray-300 flex h-100'>
              <h1 className='text-9xl font-bold'>4 0 4</h1>
            </div>
          )
        }
      ]
    }
  ])
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <NotificationContextProvider>
          <RouterProvider router={router} />
        </NotificationContextProvider>
      </CartContextProvider>
    </AuthContextProvider>
  )
}
