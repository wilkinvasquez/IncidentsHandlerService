import React, { useEffect, useState, useContext, useCallback, Fragment } from 'react';
import Button from '../elements/button';
import DepartmentsService from '../services/departments-service';
import Item from '../elements/item';
import AppContext from '../context/app-context';
import AlertTypes from '../constants/alert-types';
import ItemsHeader from '../elements/items-header';
import FormTypes from '../constants/form-types';
import DetailTypes from '../constants/detail-types';

const DepartmentsScreen = props => {
    const [state, setState] = useContext(AppContext);
    const [departments, setDepartments] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        setState(state => ({
            ...state,
            location: props.location.pathname
        }));
    }, []);

    useEffect(() => {
        if (isMounted) {
            getAllDepartments();
        }
    }, [isMounted]);

    const getAllDepartments = useCallback(() => {
        setState(state => ({
            ...state,
            isLoadingVisible: true
        }));

        DepartmentsService.getAll()
            .then(result => {
                setDepartments(result);

                setState(state => ({
                    ...state,
                    isLoadingVisible: false,
                    isSignedIn: true
                }));
            })
            .catch(error => {
                setState(state => ({
                    ...state,
                    isAlertVisible: true,
                    alertType: AlertTypes.ERROR,
                    alertText: error,
                    isLoadingVisible: false
                }));
            });
    });

    const removeDepartment = useCallback(id => {
        setState(state => ({
            ...state,
            isLoadingVisible: true,
            isAlertVisible: false
        }));

        DepartmentsService.remove(id)
            .then(() => {
                setState(state => ({
                    ...state,
                    isLoadingVisible: false,
                    isAlertVisible: true,
                    alertType: AlertTypes.SUCCESS,
                    alertText: 'Item deleted successfully!',
                }));

                getAllDepartments();
            })
            .catch(error => {
                setState(state => ({
                    ...state,
                    isLoadingVisible: false,
                    isAlertVisible: true,
                    alertType: AlertTypes.ERROR,
                    alertText: error,
                }));
            });
    });

    return (
        <Fragment>
            <div className="row">
                <div className="section-title col-lg-6 com-md-6 col-sm-6">
                    Departments
                </div>

                <div className="col-lg-6 com-md-6 col-sm-6">
                    <Button
                        title={'Create'}
                        type={"button"}
                        style={{
                            color: '#FFFFFF',
                            backgroundColor: '#2B85FF',
                            height: '35px',
                            width: '100px',
                            float: 'right',
                            fontSize: '10pt',
                            marginTop: '8px'
                        }}
                        callback={() => setState(state => ({
                            ...state,
                            isFormVisible: true,
                            formType: FormTypes.DEPARTMENT_FORM,
                            formPayload: null,
                            formCallback: () => getAllDepartments()
                        }))}
                    />
                </div>
            </div>

            <ItemsHeader textLeft={"Name"} textRight={"Action"} />

            <div className="section-items">
                {
                    departments.map((item, index) => {
                        return (
                            <Item
                                key={index}
                                formPayload={item}
                                title={item.name}
                                formType={FormTypes.DEPARTMENT_FORM}
                                formCallback={() => getAllDepartments()}
                                detailType={DetailTypes.DEPARTMENT_DETAIL}
                                detailPayload={item}
                                deleteCallback={id => removeDepartment(id)}
                            />
                        )
                    })
                }
            </div>
        </Fragment>
    );
}

export default DepartmentsScreen;