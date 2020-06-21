import React from "react";
import Axios from "axios";
import "./Product.css";
import swal from "sweetalert"
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ButtonUI from "../src/views/components/Button/Button";
import TextField from "../src/views/components/TextField/TextField";

const API_URL = `http://localhost:8080`;

class Products extends React.Component {
    state = {
        productList: [],
        activeProducts: [],
        selectedFile: null,
        formProduct: {
            productName: "",
            price: null,
            profilePicture:"",
        },
        editProduct: {
            productName: "",
            price: null,
            profilePicture: "",
        },
        modalOpen: false
    }

    inputHandler = (event, key, form) => {
        const { value } = event.target;

        this.setState({
            [form]: {
                ...this.state[form],
                [key]: value,
            }
        });
    };

    fileChangeHandler = (e) => {
        this.setState({ selectedFile: e.target.files[0] });
    };

    componentDidMount() {
        this.showProductHandler()
    }

    editBtnHandler = (idx) => {
        this.setState({
            editProduct: {
                ...this.state.productList[idx],
            },
            modalOpen: true,
            
        });
    };



    editProductHandler = () => {
        Axios.put(
            `${API_URL}/ProductsPR/${this.state.editProduct.id}`,
            this.state.editProduct
        )
            .then((res) => {
                swal("Success!", "Your item has been edited", "success");
                this.setState({ modalOpen: false });
                console.log(this.state.editProduct)
                this.showProductHandler();
            })
            .catch((err) => {
                swal("Error!", "Your item could not be edited", "error");
                console.log(err);
            });
    }

    // addProductHandler = () => {
    //     console.log("Add Product!");
    //     Axios.post(`${API_URL}/ProductsPR`, {
    //         productName: this.state.formProduct.productName,
    //         price: this.state.formProduct.price,
    //         profilePicture: this.state.formProduct.profilePicture
    //     })
    //         .then((res) => {
    //             this.showProductHandler();
    //             swal("Success!", "Your item has been added to the list", "success");
    //             console.log(res.data);
    //         })
    //         .catch((err) => {
    //             swal("Error!", "Your item could not be added to the list", "error");

    //             console.log(err);
    //         });
    // };

    showProductHandler = () => {
        Axios.get(`${API_URL}/ProductsPR`)
            .then((res) => {
                console.log(res.data);
                this.setState({ productList: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    deleteHandler = (id) => {
        Axios.delete(`${API_URL}/ProductsPR/delete/${id}`)
            .then((res) => {
                console.log(res);
                this.showProductHandler()
                swal("Delete", " ", "success")

            })
            .catch((err) => {
                console.log(err);

            })
    }

    addProductHandler = () => {
        let formData = new FormData();

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        formData.append("productData", JSON.stringify(this.state.formProduct));

        Axios.post(`${API_URL}/ProductsPR`, formData)
            .then((res) => {
                this.showProductHandler();
                swal("Success!", "Your item has been added to the list", "success");
                console.log(res.data);
            })
            .catch((err) => {
                swal("Error!", "Your item could not be added to the list", "error");
                console.log(err);
            });

        console.log(this.state.formProduct)
        console.log(JSON.stringify(this.state.formProduct))
    };

    renderProductsList = () => {
        return this.state.productList.map((val, idx) => {
            return (
                <>
                    <tr onClick={() => {
                        if (this.state.activeProducts.includes(idx)) {
                            this.setState({
                                activeProducts: [
                                    ...this.state.activeProducts.filter((item) => item !== idx),
                                ],
                            });
                        } else {
                            this.setState({
                                activeProducts: [...this.state.activeProducts, idx],
                            });
                        }
                    }}>
                        <td>{val.id}</td>
                        <td>{val.productName}</td>
                        <td>{val.price}</td>
                        <td><img src={val.profilePicture} style={{ height:"50px" }} alt=""/></td>
                    </tr>
                    <tr className={`collapse-item ${
                        this.state.activeProducts.includes(idx) ? "active" : null
                        }`}>

                        <td colSpan={2}>
                            <div className="d-flex justify-content-around align-items-center">
                                <div className="d-flex flex-column ml-4 justify-content-center">
                                    <h4>{val.productName}</h4>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <ButtonUI
                                        onClick={(_) => this.editBtnHandler(idx)}
                                        type="contained"
                                    >
                                        Edit
                                    </ButtonUI>
                                    <ButtonUI className="mt-3" type="textual" onClick={() => this.deleteHandler(val.id)} >
                                        Delete
                                     </ButtonUI>
                                </div>
                            </div>
                        </td>

                    </tr>
                </>
            )
        })
    }

    render() {
        return (
            <div className="container py-4">
                <h3>INPUT PRODUCT</h3>
                <input type="text" value={this.state.formProduct.productName} placeholder="Nama Product" onChange={(e) => this.inputHandler(e, "productName", "formProduct")} />
                <br />
                <input type="text" value={this.state.formProduct.price} placeholder="Price" onChange={(e) => this.inputHandler(e, "price", "formProduct")} />
                <br />
                <input type="file" onChange={this.fileChangeHandler} />
                <br />
                <input type="button" value="Add Product" onClick={this.addProductHandler} />
                <br />
                <br />
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>Products</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <th>Id</th>
                            <th>Nama Produk</th>
                            <th>Harga</th>
                            <th>Photo</th>
                        </thead>
                        <tbody>
                            {this.renderProductsList()}
                        </tbody>
                    </table>
                </div>

                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Product</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editProduct.productName}
                                    placeholder="Product Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "productName", "editProduct")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <TextField
                                    value={this.state.editProduct.price}
                                    placeholder="price"
                                    onChange={(e) => this.inputHandler(e, "price", "editProduct")}
                                />
                            </div>
                            <div className="col-4">
                            <input type="file" 
                                   onChange={this.fileChangeHandler} />
                            </div>
                        </div>
                        <div className="d-flex flex-row py-5">
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModal}
                                    type="outlined"
                                >
                                    Cancel
                               </ButtonUI>
                            </div>

                            <div className=" col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.editProductHandler}
                                    type="contained"
                                >
                                    Save
                             </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default Products;