import axios from 'axios';
import React, { Component, useState } from 'react';
import  BounceLoader from "react-spinners/BounceLoader";
import { Document, Page, pdfjs } from 'react-pdf';
import './ResultsPage.css';
import { Button, Card , H3, H5} from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import testPDF from './Armin.pdf'// debugging purposes
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ResultsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: null,
            results: null,
            previewPDF: null,
            user_id: ''
        };
    }

    getResultsPDF = () => {
        axios.get('http://localhost:5000/results')
    }


    // viewHandler = async () => {
    //     axios(`http://localhost:4000/pdf`, {
    //         method: "GET",
    //         responseType: "blob"
    //         //Force to receive data in a Blob Format
    //     })
    //         .then(response => {
    //             //Create a Blob from the PDF Stream
    //             const file = new Blob([response.data], {
    //                 type: "application/pdf"
    //             });
    //             //Build a URL from the file
    //             const fileURL = URL.createObjectURL(file);
    //             //Open the URL on new Window
    //             window.open(fileURL);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // };

    download_pdf = () => {
        axios.get(`http://localhost:5000/download/${this.props.match.params.user_id}`, {})
            .then((response) => {
                // download(result.data, "file.pdf", result.headers['content-type']) })
                console.log("downloaded")
                const file = new Blob([response.data], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL); })
            .catch(error => {
                console.error(error);
            });
        
    }

    cleanUp = () => {
        axios.get(`http://localhost:5000/get_user/${this.state.user_id}`)
            .then(response => {
                console.log("Deleted...")
            })
        this.props.history.replace('/');
    }

    componentDidMount = () =>  {
        this.setState({
            isLoading: true,
            previewPDF: false
        });
        console.log(this.props.match.params.user_id)
        const loading = axios.get(`http://localhost:5000/results_pdf/${this.props.match.params.user_id}`, {
            responseType: "blob"
        }).then(response => {
            console.log("BUBUUBU")
            //Create a Blob from the PDF Stream
            // console.log("???")
            const file = new Blob([response.data], {
                type: "application/pdf"
            });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            console.log("fileURL")
            console.log(fileURL)
            this.setState({
                results: fileURL,
                previewPDF: true,
                isLoading: false
            })
        }).catch(error => {
            console.log(error);
        });

        // axios(`http://localhost:5000/results/${this.state.user_id}`, {
        //     method: "GET",
        //     responseType: "blob"
        //     //Force to receive data in a Blob Format
        // }).then(response => {
        //     //Create a Blob from the PDF Stream
        //     console.log("???")
        //     const file = new Blob([response.data], {
        //         type: "application/pdf"
        //     });
        //     //Build a URL from the file
        //     const fileURL = URL.createObjectURL(file);
        //     console.log("fileURL")
        //     console.log(fileURL)
        //     this.setState({
        //         results: fileURL,
        //         previewPDF: true,
        //         isLoading: false
        //     })
        // }).catch(error => {
        //     console.log(error);
        // });

        // console.log('two')

        axios.get(`http://localhost:5000/get_file_names/${this.state.user_id}`)
            .then(response => {
                console.log(">>>>")
                console.log(response)
            })
    }

    render() {

        return (
            <header className="App-header">
                {
                    this.state.isLoading ? <BounceLoader size={200} color={"lightblue"} /> :
                    <Card className ="title_results" elevation={5} width={700} height={100}>
                        <H3 className = "title_text">FINISHED!</H3>
                    </Card>
                }
                <div className = "resultsContainer">
                    {this.state.previewPDF ?
                        <div>
                            <Document className="doc" file={this.state.results} onLoadError={console.error}>
                                <Page pageNumber={1} />
                            </Document>
                        </div>
                        :
                        <H5 className="loading-text" >
                            Cheating For You
                        </H5>
                    }
                </div>
                <Button className = "margin-top" onClick={this.download_pdf}>Download</Button>
                <br/>
                <Button className="" onClick={this.cleanUp}>go back</Button>
            </header >

        )
    }
}



export default ResultsPage; 