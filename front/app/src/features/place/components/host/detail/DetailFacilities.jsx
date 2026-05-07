import React from "react";
import styled from "styled-components";

const Section = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #eee;
  margin-bottom: 25px;

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FacilityBadge = styled.div`
  background-color: #f1f4ee;
  color: #666;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e8ede3;

  span {
    color: #768966;
    font-weight: bold;
  }
`;

function DetailFacilities({ items = [] }) {
  return (
    <Section>
      <h3>편의시설</h3>
      <BadgeContainer>
        {items.map((item, index) => (
          <FacilityBadge key={index}>
            <span>✓</span> {item}
          </FacilityBadge>
        ))}
      </BadgeContainer>
    </Section>
  );
}

export default DetailFacilities;
