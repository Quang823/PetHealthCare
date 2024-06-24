import Top from './Body/Top/Top'
import Listing from "./Body/Listing/Listing"
import Activity from "./Body/Activity/Activity"
import SideBar from '../../Components/Test/SideBar/SideBar';
import Body from '../../Components/Test/Body/Body';
const TestAdmin = () => {
    return (

        <div className="mainContent">

            <Top />
            <div className="bottom flex">
                <Listing />
                <Activity />
            </div>
        </div>
    )
}
export default TestAdmin