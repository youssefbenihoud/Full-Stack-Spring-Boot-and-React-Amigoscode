import {Popconfirm, Radio} from 'antd';
import {deleteStudent} from "./client";
import {errorNotification, successNotification} from "./Notification";
import {useState} from "react";

function ActionsButtons({studentId, studentName, fetchStudents}) {


    const onDelete = () => {
        deleteStudent(studentId).then(() => {
                successNotification(
                    "Deleted!",
                    "Student " + studentName +
                    "  with the id " + studentId +
                    "  is successfully deleted!");
                fetchStudents();
            }
        ).catch(
            err => {
                console.log("Error --> " + err.response);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        "Delete issue!",
                        res.message + " [statusCode:] " + res.status,
                        "bottomLeft")
                })
            }
        )

    }


    return <Radio.Group>
        <Popconfirm placement="top" title={"Are you sure to delete " + studentName + " ?"} onConfirm={onDelete}
                    okText="Yes" cancelText="No">
            <Radio.Button value="delete">Delete</Radio.Button>
        </Popconfirm>
        <Radio.Button value="edit">Edit</Radio.Button>
    </Radio.Group>;
}

export default ActionsButtons;