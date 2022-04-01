import React from "react";
import { Link } from "react-router-dom";
import "./imageCard.css";
import { Button, Row, Container } from "react-bootstrap";
import { ReactComponent as GoArrow } from "../../assets/arrow-up-right-square-fill.svg";
import { ReactComponent as RightArrow } from "../../assets/arrow-right-square-fill.svg";

function ImageCard({ cardData }) {
  const getImageUri = (card) => {
    if (card.card_faces) {
      return card.card_faces[0].image_uris.normal;
    } else {
      return card.image_uris.normal;
    }
  };

  return (
    <>
      <div className="content">
        <div className="content-overlay"></div>

        <img
          src={getImageUri(cardData)}
          alt="magic card"
          style={{ borderRadius: "10px", maxWidth: "222px" }}
          className="content-image"
        />
        <div className="content-details fadeIn-bottom">
          <Container>
            <Row className="g-5">
              <h6 className="text-light">{cardData.name}</h6>
              <Button variant="secondary">Quick Add</Button>
              <Link to={`/cards/${cardData.id}`}>
                <Button variant="warning">
                  <span className="align-middle">
                    View Details <GoArrow />
                  </span>
                </Button>
              </Link>
            </Row>
          </Container>
        </div>
      </div>
      {cardData?.card_faces && (
        <div style={{ position: "relative", maxWidth: "222px" }}>
          <RightArrow
            style={{
              position: "absolute",
              bottom: "150",
              right: "-40",
              color: "#212529",
              backgroundColor: "#ffc107",
              border: "2px solid #ffc107",
              borderRadius: "4px",
            }}
          />
        </div>
      )}
    </>
  );
}

export default ImageCard;
