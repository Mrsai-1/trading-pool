import { useNavigate, useParams, useLocation } from 'react-router-dom';
import React, { useRef } from 'react';

export function pushRoute(Component) {
  
  return (props) => (
    <Component
      {...props}
      location={useLocation()}
      params={useParams()}
      navigate={useNavigate()}
      useRef={useRef()}
    />
  );
}
