import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}



class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: []

        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.DeleteUserRedux(user.id)
    }
    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }

    render() {

        let arrUsers = this.state.usersRedux;
        return (
            <React.Fragment>
            <table id='TableManageUser'>
                <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Address</th>
                    <th>Action</th>
                </tr>
                {arrUsers && arrUsers.length > 0 &&

                    arrUsers.map((item, index) => {
                        return (
                        <tr key={index}>
                            <td>{item.email}</td>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.address}</td>
                            <td>
                                <button 
                                onClick={() => this.handleEditUser(item)}
                                className='btn-edit'><i className="fa-solid fa-pencil"></i></button>
                                <button 
                                onClick={() => this.handleDeleteUser(item)}
                                className='btn-delete'><i className="fa-solid fa-trash"></i></button>
                            </td>
        
                        </tr>
                            )
                    })
                }
                
            </table>
                </React.Fragment>

        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        DeleteUserRedux: (id) => dispatch(actions.DeleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
