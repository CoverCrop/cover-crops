import {connect} from "react-redux";
import DashboardPageComponent from "../components/DashboardPage";

const mapStateToProps = (state, ownProps) => {
    return {
		email: state.user.email
    };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//         onChangex: (event, valy) => {
//             dispatch(actionName(valy));
//         }
//     }
// };

const DashboardPage = connect(mapStateToProps)(DashboardPageComponent);

export default DashboardPage;
