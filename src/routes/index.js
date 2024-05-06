import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import DoanhThu from "../commponents/DoanhThu";
import Kho from "../commponents/Kho";
import DoanhThuBang from "../commponents/DoanhThuBang";
import DoanhThuBangQuy from "../commponents/DoanhThuBangQuy";
import DoanhThuBangNam from "../commponents/DoanhThuBangNam";
import DoanhThuThangQuy from "../commponents/DoanhThuThangQuy";
import DoanhThuThangNam from "../commponents/DoanhThuThangNam";


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
                path: "/doanh-thu-tp-quy",
                element: <DoanhThuThangQuy />
            },
            {
                path: "/doanh-thu-tp-nam",
                element: <DoanhThuThangNam />
            },
            {
                path: "/doanh-thu-bang",
                element: <DoanhThuBang />
            },
            {
                path: "/doanh-thu-bang-quy",
                element: <DoanhThuBangQuy />
            },
            {
                path: "/doanh-thu-bang-nam",
                element: <DoanhThuBangNam />
            },
            {
                path: "/kho",
                element: <Kho />
            },
           
        ]
    }
])

export default router;