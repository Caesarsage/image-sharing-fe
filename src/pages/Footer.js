import React from "react";

export const Footer = () => {
  return (
    <footer className="container mt-auto">
      <div className="container-fluid text-center text-md-left">
        <div className="row">
          <div className="col-md-6 mt-md-0 mt-3">
            <h6 className="text-uppercase">
              <a href="https://github.com/Caesarsage">Build by caesarsage ❤</a>
            </h6>
          </div>
          <hr className="clearfix w-100 d-md-none pb-3" />
          <div className="col-md-3 mb-md-0 mb-3">
            <ul className="list-unstyled">
              <a href="https://linkedin.com/in/destiny-erhabor">
                Connect <i className="fa fa-linkedin" aria-hidden="true"></i>
              </a>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
