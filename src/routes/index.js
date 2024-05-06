import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import DoanhThu from "../commponents/DoanhThu";
import Kho from "../commponents/Kho";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/doanh-thu",
                element: <DoanhThu />
            },
            {
                path: "/kho",
                element: <Kho />
            },
           
        ]
    }
])

export default router;