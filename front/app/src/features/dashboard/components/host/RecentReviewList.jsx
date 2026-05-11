import styled from 'styled-components'
import { Card, Section, Button, EmptyState } from '../../../pay_shared/components'

export function RecentReviewList({ reviews, onSeeAll, onClickReview }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Section title="최근 리뷰">
        <EmptyState
          icon="✍️"
          title="아직 리뷰가 없어요"
          description="첫 리뷰를 기다려보세요"
        />
      </Section>
    )
  }

  return (
    <Section
      title="최근 리뷰"
      action={
        <Button variant="ghost" size="sm" onClick={onSeeAll}>
          전체 →
        </Button>
      }
    >
      <ListCard>
        {reviews.map((review) => (
          <ReviewItem key={review.id} onClick={() => onClickReview?.(review)}>
            <Header>
              <Stars>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} $filled={i < review.rating}>
                    ★
                  </Star>
                ))}
              </Stars>
              <ReviewDate>{review.date}</ReviewDate>
            </Header>

            <Content>{review.content}</Content>

            <Footer>
              <Reviewer>{review.reviewer}</Reviewer>
              <Sep>·</Sep>
              <SpaceTag>
                {review.spaceEmoji} {review.spaceName}
              </SpaceTag>
            </Footer>
          </ReviewItem>
        ))}
      </ListCard>
    </Section>
  )
}

const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`

const ReviewItem = styled.button`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--space-4);
  background: var(--white);
  border: none;
  border-bottom: 1px solid var(--gray-200);
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease;

  &:hover {
    background: var(--cream);
  }

  &:last-child {
    border-bottom: none;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`

const Stars = styled.div`
  display: flex;
  gap: 1px;
`

const Star = styled.span`
  font-size: 0.95rem;
  color: ${(props) => (props.$filled ? '#D4861F' : 'var(--gray-200)')};
`

const ReviewDate = styled.span`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-400);
`

const Content = styled.p`
  font-size: 0.85rem;
  color: var(--gray-800);
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--gray-600);
`

const Reviewer = styled.span`
  font-weight: 500;
`

const Sep = styled.span`
  opacity: 0.4;
`

const SpaceTag = styled.span``
