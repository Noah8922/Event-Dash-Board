import {
  ActionList,
  Button,
  Card,
  Form,
  FormLayout,
  Modal,
  Page,
  Popover,
  ResourceList,
  TextField,
  TextStyle,
  Thumbnail,
  TextContainer,
} from "@shopify/polaris";
import { useCallback, useEffect, useState, useRef } from "react";
import { LiveStatus } from "../entities/live-event.entity";
import { Product } from "../entities/product.entity";
import { useHistory } from "react-router-dom";
export function LiveEventCreationPage() {
  const history = useHistory();

  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<LiveStatus>();
  const [select, setSelect] = useState<string>("이벤트 선택하기");
  const [selectProduct, setSelectProduct] = useState<string>("상품 선택하기")

  const [selectedProducts, setSelectedProducts] = useState<string[]>();
  const [products, setProducts] = useState<Product[]>([]);

  const [popoverActive, setPopoverActive] = useState<boolean>(false);
  const [modalActive, setModalActive] = useState<boolean>(false);

  const handleModalChange = useCallback(
    () => {
      setModalActive(!modalActive)
    },
    [modalActive]
  );

  useEffect(() => {
    fetch("http://localhost:5000/product")
      .then((response) => response.json())
      .then((res) => setProducts(res.products));
  }, []);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      status: status,
      productIds: selectedProducts,
    }),
  };

  const handleSubmit = useCallback(() => {
    if (title === "") {
      alert("제목을 입력해주세요");
    } else if (status === undefined) {
      alert("상태를 선택해주세요");
    } else if (selectedProducts === undefined) {
      alert("상품을 선택해주세요");
    } else {
      fetch("http://localhost:5000/live-event", requestOptions)
      history.push("/live-event");
    }
    
  }, [title, status, selectedProducts]);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const handleTitleChange = useCallback((value) => setTitle(value), []);
  const popOverActivator = (
    <Button onClick={togglePopoverActive} disclosure>
      {select}
    </Button>
  );

  const handleProductLive = () => {
    setStatus(LiveStatus.LIVE);
    togglePopoverActive();
    setSelect("진행");
  };

  const handleProductScheduled = () => {
    setStatus(LiveStatus.SCHEDULED);
    togglePopoverActive();
    setSelect("예정");
  };

  const handleProductfinished = () => {
    setStatus(LiveStatus.FINISHED);
    togglePopoverActive();
    setSelect("종료");
  };
  const modalActivator = (
    <Button onClick={handleModalChange}>{selectProduct}</Button>
  );



  return (
    <Page
      title={"이벤트 생성 페이지"}
      breadcrumbs={[
        {
          content: "live event",
          onAction() {
            history.push("list");
          },
        },
      ]}
    >
      <Card title={"이벤트 생성하기"}>
        <Card.Section>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                value={title}
                onChange={handleTitleChange}
                label="제목"
                type="text"
              />
              <Popover
                active={popoverActive}
                activator={popOverActivator}
                onClose={togglePopoverActive}
              >
                <ActionList
                  items={[
                    {
                      content: "예정",
                      onAction: handleProductScheduled,
                    },
                    {
                      content: "진행",
                      onAction: handleProductLive,
                    },
                    {
                      content: "종료",
                      onAction: handleProductfinished,
                    },
                  ]}
                />
              </Popover>
              <Modal
                activator={modalActivator}
                open={modalActive}
                onClose={handleModalChange}
                title="상품을 선택해주세요."
                primaryAction={{
                  content: "상품 추가 완료",
                  onAction: handleModalChange,
                }}
              >
                <Modal.Section>
                  <ResourceList
                    selectedItems={selectedProducts}
                    onSelectionChange={(selectedProducts: string[]) => {
                      setSelectedProducts(selectedProducts);
                      const length = selectedProducts.length
                      setSelectProduct(`${length}개의 상품을 선택하였습니다.`)
                    }}
                    selectable
                    items={products.map((product) => ({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      media: (
                        <Thumbnail
                          source={product.thumbnail}
                          alt={product.name}
                        />
                      ),
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
                </Modal.Section>
              </Modal>
              <Button primary submit>
                이벤트 생성하기
              </Button>
            </FormLayout>
          </Form>
        </Card.Section>
      </Card>
    </Page>
  );
}
