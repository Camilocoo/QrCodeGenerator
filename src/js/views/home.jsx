import React from "react";
import "../../styles/home.css";
import PropTypes from "prop-types";
import axios from "axios";
import QRCode from "qrcode.react";

export class Home extends React.Component {
	constructor(props) {
		super(props);
		let cohorts = props.match.params.cohorts;

		this.state = {
			showQr: true,
			data: [],
			items: [],
			isLoaded: false,
			show: cohorts ? false : true,
			qrCode: {
				ssid: "",
				pwd: "",
				res: "1080p",
				rate: "3",
				dur: "0",
				url: ""
			},
			selectedCohort: null
		};
	}

	componentDidMount() {
		let cohorts = this.props.match.params.cohorts;
		cohorts
			? fetch(
					"http://assets.breatheco.de/apis/streaming/cohort/" +
						cohorts
			  )
					.then(res => res.json())
					.then(json => {
						this.setState({
							isLoaded: true,
							data: json,
							qrCode: Object.assign(this.state.qrCode, {
								url: json.rtmp
							})
						});
					})
			: null;

		fetch("https://api.breatheco.de/cohorts/")
			.then(res => res.json())
			.then(json => {
				this.setState({
					isLoaded: true,
					items: json,
					qrCode: Object.assign(this.state.qrCode, { url: json.rtmp })
				});
			});
	}
	changeHandler = e => {
		this.setState({
			qrCode: Object.assign(this.state.qrCode, { ssid: e.target.value })
		});
	};
	changeHandlerPwd = e => {
		this.setState({
			qrCode: Object.assign(this.state.qrCode, { pwd: e.target.value })
		});
	};

	handleSubmit = e => {
		this.setState({ showQr: false });
	};

	showQr = () => {};
	render() {
		let inputResult;
		let { isLoaded, items } = this.state;
		let data = items.data;
		let counter = 0;

		if (this.state.show) {
			inputResult = (
				<div className="form-group">
					<label htmlFor="formGroupExampleInput2">
						Select Cohort
					</label>
					<select
						onChange={e => {
							this.setState({ selectedCohort: e.target.value });
							fetch(
								"http://assets.breatheco.de/apis/streaming/cohort/" +
									e.target.value
							)
								.then(res => res.json())
								.then(streamingJson => {
									this.setState({
										isLoaded: true,
										data: streamingJson,
										qrCode: Object.assign(
											this.state.qrCode,
											{ url: streamingJson.rtmp }
										)
									});
								});
						}}
						className="custom-select custom-select-md mb-3">
						<option defaultValue>Open this select menu</option>
						{data &&
							data.map((item, index) => {
								return (
									<option key={index} value={item.slug}>
										{item.name}
									</option>
								);
							})}
					</select>
				</div>
			);
		}
		return (
			<div className="w-50 d-flex justify-content-center mx-auto text-center align-self-center h-50">
				{this.state.showQr ? (
					<form
						className="align-self-bottom border-info mt-5"
						onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="formGroupExampleInput">
								Wi-Fi Username
							</label>
							<input
								type="text"
								value={this.state.qrCode.ssid}
								className="form-control"
								id="formGroupExampleInput"
								placeholder="Example input"
								onChange={this.changeHandler}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="formGroupExampleInput2">
								Wi-Fi Password
							</label>
							<input
								type="text"
								className="form-control"
								id="formGroupExampleInput2"
								placeholder="Another input"
								value={this.state.qrCode.pwd}
								onChange={this.changeHandlerPwd}
							/>
						</div>
						{inputResult}
						<button type="submit" className="btn btn-success">
							Generate QR
						</button>
					</form>
				) : null}

				{this.state.showQr ? null : (
					<div className="align-self-center border-info">
						<QRCode
							value={JSON.stringify(this.state.qrCode)}
							size="200"
						/>
					</div>
				)}
			</div>
		);
	}
}

Home.propTypes = {
	match: PropTypes.object,
	params: PropTypes.object
};
