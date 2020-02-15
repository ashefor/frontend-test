import React, { Component, createRef } from 'react';
import { Select, Upload, message, Button, Icon, Row, Col, Progress } from 'antd';
const { Option } = Select;

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },
};
const url = 'https://37b0a67e-4593-4027-b07a-93caf29e1814.mock.pstmn.io';

class CompareComponent extends Component {
    constructor(props) {
        super(props)
        this.inputFileRef = createRef();
        this.state = {
            data: [],
            students: [],
            value1: undefined,
            value2: undefined,
            student1FileContent: undefined,
            student2FileContent: undefined,
            similarity: undefined,
            percent: 1,
            uploading: false
        };
    }
    handleFirstStudentSelect = value1 => {
        
        this.setState({ value1 });

    };
    handleSecondStudentSelect = value2 => {
        this.setState({ value2 });
    };
    handleOnchange = (info, index) => {
        let fileToUpload;
        if (info.file.status !== 'uploading') {
            fileToUpload = info.file.originFileObj
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            var fileReader = new FileReader();
            fileReader.onload = (fileLoadedEvent) => {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                if (index === 1) {
                    this.setState({ student1FileContent: textFromFileLoaded });
                } else {
                    this.setState({ student2FileContent: textFromFileLoaded })
                }
            };
            fileReader.readAsText(fileToUpload, "UTF-8");
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    levenshtein_distance_a (a, b) {
        if(a.length === 0) return b.length; 
        if(b.length === 0) return a.length; 
      
        var matrix = [];
      
        var i;
        for(i = 0; i <= b.length; i++){
          matrix[i] = [i];
        }
      
        var j;
        for(j = 0; j <= a.length; j++){
          matrix[0][j] = j;
        }
      
        for(i = 1; i <= b.length; i++){
          for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) === a.charAt(j-1)){
              matrix[i][j] = matrix[i-1][j-1];
            } else {
              matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                                      Math.min(matrix[i][j-1] + 1, 
                                               matrix[i-1][j] + 1)); 
            }
          }
        }
        return matrix[b.length][a.length];
      }
    compareString = () => {
        const {value1, value2} = this.state;
        const {student1FileContent, student2FileContent} = this.state;
        if(student1FileContent && student2FileContent){
            if (value1 === value2) {
                return message.warn("You can not compare for same user")
            }
            this.setState({uploading: true})
            const progress = setInterval(() => {
                this.setState({percent: this.state.percent + 1})
                if(this.state.percent === 100){
                    clearInterval(progress);
                    this.setState({percent: 0, uploading: false})
            const similarity = Math.ceil(100 - 100 * this.levenshtein_distance_a(student1FileContent, student2FileContent)/ Math.max(student1FileContent.length, student2FileContent.length));
            this.setState({similarity})
                }
              }, 20);
        }
          

    }
      
    componentDidMount(){
        fetch(`${url}/students`).then(res=> res.json()).then(res=> {
            // console.log(res)
            this.setState({students: res})
        })
    }
    render() {
        const {students, value1, value2, similarity, uploading} = this.state
        const options2 = students.map((d) => <Option key={d.name}>{d.name}</Option>);

        return (
            <div style={{
                height: '100vh',
                position: 'relative'
            }}>

<h3 style={{textAlign: 'center', fontSize: 30}}>Compare Students' Text</h3>
               <div>
               <Row type="flex" justify="space-around" align="middle" style={{height: '100%'}}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <fieldset>
                            <legend>Student A</legend>
                            <div>
                                <Select
                                    showSearch
                                    className="select-custom"
                                    value={value1}
                                    placeholder="Select student"
                                    optionFilterProp="children"
                                    onChange={this.handleFirstStudentSelect}
                                    defaultActiveFirstOption={false}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {options2}
                                </Select>
                            </div>

                            <div>
                                <Upload {...props} onChange={(e) => this.handleOnchange(e, 1)}>
                                    <Button>
                                        <Icon type="upload" /> Click to upload Text
                            </Button>
                                </Upload>
                            </div>
                        </fieldset>


                        <fieldset>
                            <legend>Student B</legend>
                            <div>
                                <Select
                                    showSearch
                                    className="select-custom"
                                    value={value2}
                                    placeholder="Select second student"
                                    optionFilterProp="children"
                                    onChange={this.handleSecondStudentSelect}
                                    defaultActiveFirstOption={false}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {options2}
                                </Select>
                            </div>

                            <div>
                                <Upload {...props} onChange={(e) => this.handleOnchange(e, 2)}>
                                    <Button>
                                        <Icon type="upload" /> Click to upload Text
                            </Button>
                                </Upload>
                            </div>
                        </fieldset>
                {uploading && <Progress strokeLinecap="square" percent={this.state.percent} />}
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} className='resultsDiv'>
                        {similarity && <div style={{textAlign: 'center'}}>
                            <Progress type="circle" width={150} strokeWidth={7} percent={similarity} strokeColor={similarity <= 35? '#87d068': similarity > 35 <= 70 ? '#108ee9' : '#ff5500'}
                            status={similarity <= 35? 'success': similarity > 35 <=70 ? 'normal' : 'exception'}/>
                        <h5 style={{marginTop: '20%', fontSize: 50}}>{similarity}% similar</h5>
                            </div>}
                        
                    </Col>
                </Row>
                <div style={{marginTop: '1.5%'}}>
                    <Button onClick={this.compareString} type="primary"  size='large'>
                        Compare
                    </Button>
                </div>
               </div>

            </div>
        );
    }
}

export default CompareComponent