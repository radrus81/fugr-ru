import React, { Fragment } from 'react'
import './Table.css'

export default props => (
    <table className="table">
        <thead>
            <tr>
                <th onClick={props.onSort.bind(null, 'id')}>
                    id {props.sortField === 'id' ? <small>{props.sortType}</small> : <small>asc</small>}
                </th>
                <th onClick={props.onSort.bind(null, 'firstName')}>
                    First Name {props.sortField === 'firstName' ? <small>{props.sortType}</small> : <small>asc</small>}
                </th>
                <th onClick={props.onSort.bind(null, 'lastName')}>
                    Lact Name {props.sortField === 'id' ? <small>{props.sortType}</small> : <small>asc</small>}
                </th>
                <th onClick={props.onSort.bind(null, 'email')}>
                    Email {props.sortField === 'email' ? <small>{props.sortType}</small> : <small>asc</small>}
                </th>
                <th onClick={props.onSort.bind(null, 'phone')}>
                    Phone {props.sortField === 'phone' ? <small>{props.sortType}</small> : <small>asc</small>}
                </th>
            </tr>
        </thead>
        <tbody>
            {props.data.map((item, index) => (
                <Fragment key={item.id + index}>
                    <tr className={!index && props.isAddInputs ? "showAddRow" : "hideAddRow"}>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(event) => props.onAddInputValue(event.target.value, 'id')}
                            />
                        </td>
                        <td><input type="text" className="form-control" onChange={(event) => props.onAddInputValue(event.target.value, 'firstName')} /></td>
                        <td><input type="text" className="form-control" onChange={(event) => props.onAddInputValue(event.target.value, 'lastName')} /></td>
                        <td><input type="text" className="form-control" onChange={(event) => props.onAddInputValue(event.target.value, 'email')} /></td>
                        <td><input type="text" className="form-control" onChange={(event) => props.onAddInputValue(event.target.value, 'phone')} /></td>
                    </tr>
                    <tr onClick={props.onRowSelect.bind(null, item)}>
                        <td>{item.id}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.email}</td>
                        <td>{item.phone} </td>
                    </tr >
                </Fragment>
            ))}
        </tbody>
    </table >

)