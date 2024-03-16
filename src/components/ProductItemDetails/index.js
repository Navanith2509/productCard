// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Header from '../Header'

const statusList = {
  success: 'Success',
  failure: 'Failure',
  inProgress: 'InProgress',
}

class ProductItemDetails extends Component {
  state = {status: statusList.inProgress, productData: '', quantity: 1}

  componentDidMount() {
    this.getData()
  }

  onIncrease = () => this.setState(prevState => ({quantity: prevState.quantity + 1}))

  onDecrease = () => {
    if(quantity>1){
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }
  

  getData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const similarProducts = data.similar_products.map(each => ({
      availability: each.availability,
      brand: each.brand,
      description: each.description,
      imageUrl: each.image_url,
      price: each.price,
      rating: each.rating,
      style: each.style,
      title: each.title,
      totalReviews: each.total_reviews,
    }))

    const updatedData = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }
    console.log(updatedData)
    if (response.ok) {
      this.setState({status: statusList.success, productData: updatedData})
    } else {
      this.setState({status: statusList.failure})
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/producs')
  }

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.continueShopping}>
       Continue Shopping
      </button>
    </div>
  )

  renderSuccess = () => {
    const {productData, quantity} = this.state
    const {
      id,
      imageUrl,
      availability,
      brand,
      description,
      price,
      rating,
      similarProducts,
      title,
      totalReviews,
    } = productData
    return (
      <div key={id}>
        <Header />
        <div>
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>Rs {price} /-</p>
            <div>
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p>{totalReviews} Reviews</p>
            <p>{description}</p>
            <p>Available:{availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div>
              <button
                onClick={this.onDecrease}
                type="button"
                data-testid="minus"
              >
                <div>
                  <BsDashSquare />
                </div>
              </button>

              <p>{quantity}</p>

              <button
                onClick={this.onIncrease}
                type="button"
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">Add to Cart</button>
          </div>
          <h1>Similar Products</h1>

          {similarProducts.map(each => (
            <li key={each.id}>
              <img src={each.imageUrl} alt="similar product" />
              <p>{each.title}</p>
              <p>by {each.brand}</p>
              <p>Rs {price} /-</p>
              <div>
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
            </li>
          ))}
        </div>
      </div>
    )
  }

  render() {
    const {status} = this.state

    switch (status) {
      case statusList.success:
        return this.renderSuccess()
      case statusList.failure:
        return this.renderFailure()
      case statusList.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}
export default ProductItemDetails
