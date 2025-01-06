import React, { Component } from 'react';
import Joi from 'joi-browser';

class Form extends Component {
  state = {};

  handleChange = (input) => {
    input = input.target;

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleNumber = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value
      .replace(/[^\d\.]/g, '')
      .replace(/\.(([^\.]*)\.)*/g, '.$2');
    this.setState({ data, errors });
  };

  loginusernamehandlechange = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value
      .replace(/[\"\'~`#£*!#$%^&()={}[\]:;,<>+\/?-]+|^\s+$/g, '')
      .replace(/\s/g, '');

    if (input.value === '') delete data[input.name];
    this.setState({ data, errors });
  };

  handlephonenumber = (value) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };

    data.phone = value;
    const input = { name: 'phone', value: value };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    this.setState({ data, errors });
  };

  handleChangeNoSp = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value
      .replace(/[\"\'~`#£*!@#$%^&()_={}[\]:;,.<>+\/?-]+|\d+|^\s+$/g, '')
      .replace(/\s/g, '');

    if (input.value === '') delete data[input.name];
    this.setState({ data, errors });
  };

  handleChangeNAddress = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };

    data[input.name] = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (input.value === '') delete data[input.name];
    this.setState({ data, errors });
  };

  handleChangeEmail = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };

    if (input.value === ' ') {
      input.value = '';
      return;
    }

    data[input.name] = input.value.replace(/[^\w\s@.]/gi, '');
    if (input.value === '') delete data[input.name];

    this.setState({ data, errors });
  };

  handleChangeNoSpp = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };

    if (input.value === ' ') {
      input.value = '';
      return;
    }
    data[input.name] = input.value.replace(/[^\w\s@.\-/]/gi, '');
    if (input.value === '') delete data[input.name];
    this.setState({ data, errors });
  };

  handleChangeUsername = (input) => {
    input = input.target;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };

    if (input.value === ' ') {
      input.value = '';
      return;
    }

    data[input.name] = input.value.replace(/[^\w\s.]/gi, '').trim();
    if (input.value === '') delete data[input.name];

    this.setState({ data, errors });

    this.usernamecheck();
  };
  handleSelectChange = (selectedOption, name) => {
    try {
      const input = { name: name, value: selectedOption?.value };
      const errors = { ...this.state.errors };
      const errorMessage = this.validateProperty(input);
      if (errorMessage) errors[input.name] = errorMessage;
      else delete errors[input.name];
      const data = { ...this.state.data };
      data[input.name] = input.value;
      this.setState({ data, errors, selectedOption: selectedOption });
    } catch (error) {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };
  validateProperty = ({ name, value }) => {
    if (name === 'cpassword') {
      const { data } = this.state;
      const obj = { password: data.password, [name]: value };
      const schema = {
        [name]: this.schema[name],
        password: this.schema['password'],
      };
      const { error } = Joi.validate(obj, schema);
      return error ? error.details[0].message : null;
    } else {
      const obj = { [name]: value };
      const schema = { [name]: this.schema[name] };
      const { error } = Joi.validate(obj, schema);
      return error ? error.details[0].message : null;
    }
  };
  handleSelect = async (res) => {
    const input = { name: res.target.name, value: res.target.value };
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleSubmit = (e) => {
    if (e) e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };
  render() {
    return <p />;
  }
}

export default Form;
