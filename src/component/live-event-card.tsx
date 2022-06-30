import { FC } from "react";
import { LiveEventCardProps } from "../interface/event-card.props";
import { Card, ResourceList, TextStyle, Thumbnail } from "@shopify/polaris";

export const LiveEventCard: FC<LiveEventCardProps> = ({
  event,
  products,
  onDeleteAction,
  onFinishedEventAction,
}) => {
  return (
    <Card
      title={event.title}
      primaryFooterAction={{
        content: "이벤트 종료하기",
        onAction: async () => {
          await onFinishedEventAction(event.id);
        },
      }}
      secondaryFooterActions={[
        {
          content: "이벤트 삭제하기",
          destructive: true,
          onAction: async () => {
            await onDeleteAction(event.id);
          },
        },
      ]}
    >
      <Card.Section title="상품 리스트">
        <ResourceList
          items={products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            media: <Thumbnail source={product.thumbnail} alt={product.name} />,
          }))}
          renderItem={(item) => {
            const { id, name, media, price } = item;
            return (
              <ResourceList.Item
                id={id}
                onClick={() => {}}
                media={media}
                accessibilityLabel={`View details for ${name}`}
              >
                <h3>
                  <TextStyle variation="strong">{name}</TextStyle>
                </h3>
                <div>￦{price}</div>
              </ResourceList.Item>
            );
          }}
        />
      </Card.Section>
    </Card>
  );
};
