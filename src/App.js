import React, { Component } from 'react'
import Loader from './Loader/Loader'
import Table from './Table/Table'
import _ from 'lodash'
import ReactPagination from 'react-js-pagination'
import DetailRowView from './DetailRowView/DetailRowView'
import ModeSelector from './ModeSelector/ModeSelector'
import TableSearch from './TableSearch/TableSearch'

const pageSize = 50

class App extends Component {

  state = {
    isModeSelector: false,
    isLoading: false,
    isAddInputs: false,
    isSaveButton: false,
    data: [],
    searchValue: '',
    sortType: 'asc',
    sortField: 'id',
    row: null,
    activePage: 1,
    displayData: [],
    fullSearchData: [],
    searchDataCount: 0,
    valueFromInput: {}
  }


  async fetchData(url) {
    const response = await fetch(url)

    const data = _.orderBy(await response.json(), this.state.sortField, this.state.sortType)

    this.setState({
      isLoading: false,
      data: data,
      displayData: _.chunk(data, pageSize)[this.state.activePage - 1]
    })
  }

  onSort = sortField => {

    var clonedData = this.state.displayData.concat()

    const sortType = this.state.sortType === 'asc' ? 'desc' : 'asc'

    const orderedData = _.orderBy(clonedData, sortField, sortType)
    this.setState({
      displayData: orderedData,
      sortType, sortField
    })
  }

  onRowSelect = row => { this.setState({ row }) }

  modeSelectHandler = url => {
    this.setState({
      isModeSelector: true,
      isLoading: true
    })
    this.fetchData(url)
  }

  PageChangeHandler = page => {

    var data = this.state.data
    if (this.state.searchValue) {
      data = this.state.fullSearchData
    }

    const displayData = _.chunk(data, pageSize)[page - 1]
    this.setState({
      activePage: page,
      displayData,
      isAddInputs: false
    })
  }

  searchHendler = searchValue => {

    var clonedData = this.state.data.concat()

    if (searchValue) {
      clonedData = clonedData.filter(item => {
        return item['firstName'].toLowerCase().includes(searchValue.toLowerCase())
          || item['lastName'].toLowerCase().includes(searchValue.toLowerCase())
          || item['email'].toLowerCase().includes(searchValue.toLowerCase())
      })
    }
    const displayData = _.chunk(clonedData, pageSize)[0]

    this.setState({
      searchValue,
      displayData,
      fullSearchData: clonedData,
      activePage: 1,
      searchDataCount: clonedData.length,
      isAddInputs: false
    })

  }

  addRow() {
    this.setState({
      isAddInputs: true
    })
  }

  onAddInputValue = (valueFromInput, field) => {
    var cloneValueFromInput = this.state.valueFromInput

    if (valueFromInput) {
      cloneValueFromInput[field] = valueFromInput
    } else {
      delete cloneValueFromInput[field]
    }

    this.setState({
      valueFromInput: cloneValueFromInput
    })

    this.setState({
      isSaveButton: Object.keys(this.state.valueFromInput).length === 5 ? true : false
    })

  }

  saveRow = () => {
    var cloneData = this.state.data
    var cloneDisplayData = this.state.displayData

    var cloneValueInput = this.state.valueFromInput
    cloneValueInput.description = 'description'
    cloneValueInput.address = { 'streetAddress': 'streetAddress', 'city': 'city', 'state': 'state', 'zip': 'zip' }

    cloneDisplayData.unshift(cloneValueInput)
    cloneData.unshift(cloneValueInput)

    this.setState({
      displayData: cloneDisplayData,
      data: cloneData,
      isSaveButton: false,
      isAddInputs: false,
      valueFromInput: {}
    })
  }

  render() {
    if (!this.state.isModeSelector) {
      return (
        <div className="container">
          <ModeSelector onSelect={this.modeSelectHandler} />
        </div>
      )
    }

    return (
      <div className="container">
        {
          this.state.isLoading ?
            <Loader />
            :
            <>
              <TableSearch
                onChange={this.searchHendler} />
              {
                !this.state.isSaveButton ?
                  <button onClick={() => this.addRow()} className="btn btn-primary mb-3">Добавить</button>
                  : <button onClick={() => this.saveRow()} className="btn btn-primary mb-3">Добавить в таблицу</button>
              }

              <Table
                data={this.state.displayData}
                onSort={this.onSort}
                isAddInputs={this.state.isAddInputs}
                sortType={this.state.sortType}
                isShowRowChildren={this.state.isShowRowChildren}
                sortField={this.state.sortField}
                onRowSelect={this.onRowSelect}
                onAddInputValue={this.onAddInputValue}


              />
            </>
        }

        {
          this.state.data.length > pageSize ?
            <ReactPagination
              prevPageText={'<'}
              nextPageText={'>'}
              itemsCountPerPage={pageSize}
              activePage={this.state.activePage}
              totalItemsCount={!this.state.searchValue ? this.state.data.length : this.state.searchDataCount}
              pageRangeDisplayed={7}
              activeClass={'active'}
              itemClass={'page-item'}
              linkClass={'page-link'}
              onChange={this.PageChangeHandler}
            />
            : null
        }

        {
          this.state.row ?
            <DetailRowView person={this.state.row} />
            : null
        }


      </div>
    );
  }
}

export default App;
