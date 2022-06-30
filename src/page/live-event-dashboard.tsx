import {
  AppProvider,
  Heading,
  Layout,
  Page,
  ResourceList,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import {
  FinishedEventCardProps,
  LiveEventCardProps,
  ScheduledEventCardProps,
} from "../interface/event-card.props";
import { LiveStatus } from "../entities/live-event.entity";
import FinishedEventCard from '../component/finished-event-card';
import LiveEventCard from '../component/live-event-card';
import { useHistory } from "react-router-dom";
import { LiveEvent } from "../entities/live-event.entity";
import ScheduledEventCard from '../component/scheduled-event-card';

export function LiveEventDashboard() {
  const history = useHistory();
  const baseURL = "http://localhost:5000";

  const [allEventList, setallEventList] = useState<LiveEvent[]>();

  //schduled
  const [scheduledEvent, setScheduledEvent] = useState<LiveEvent>(Object);
  const [scheduledProduct, setScheduledProduct] = useState([]);
  const [scheduledId, setScheduledId] = useState("");
  const [isScheduledEvent, setIsScheduledEvent] = useState<boolean>(false);
  const [isScheduledProduct, setIsScheduledProduct] = useState<boolean>(false);

  // Live
  const [liveEvent, setLiveEvent] = useState<LiveEvent>(Object);
  const [liveProdcut, setLiveProduct] = useState([]);
  const [liveId, setLiveId] = useState<string>("");
  const [isLiveEvent, setIsLiveEvent] = useState<boolean>(false);
  const [isLiveProduct, setIsLiveProduct] = useState<boolean>(false);

  // Finished
  const [finishedEvent, setFinishedEvent] = useState<LiveEvent>(Object);
  const [finishedProduct, setFinishedProduct] = useState([]);
  const [finishedId, setFinishedId] = useState<string>("");
  const [isFinishedEvent, setIsFinishedEvent] = useState<boolean>(false);
  const [isFinishedProduct, setIsFinishedProduct] = useState<boolean>(false);

  useEffect(() => {
    // EventList 가져오는 부분
    fetch("http://localhost:5000/live-event")
      .then((response) => response.json())
      .then((res) => {
        const eventList: LiveEvent[] = res.liveEvents;
        setallEventList(eventList);

        if (eventList.length === 0) {
          return;
        }

        if (eventList.length > 0) {
          const scheduledArray = eventList.filter(
            //
            (item) => item.status === "scheduled"
          );

          const liveArray = eventList.filter(
            //
            (item) => item.status === "live"
          );

          const finishedArray = eventList.filter(
            //
            (item) => item.status === "finished"
          );

          if (scheduledArray.length >= 1) {
            const length = scheduledArray.length - 1;
            const scheduledEvent = scheduledArray[length];
            setScheduledEvent(scheduledEvent);
            setScheduledId(scheduledEvent.id);
            const id = scheduledEvent.id;
            fetch(`${baseURL}/live-event/${id}/products`)
              .then((res) => res.json())
              .then((res) => {
                setScheduledProduct(res.products);
              });
            setIsScheduledEvent(true);
            setIsScheduledProduct(true);
          }

          if (liveArray.length >= 1) {
            const length = liveArray.length - 1;
            const liveEvent = liveArray[length];
            setLiveEvent(liveEvent);
            setLiveId(liveEvent.id);
            const id = liveEvent.id;
            fetch(`${baseURL}/live-event/${id}/products`)
              .then((res) => res.json())
              .then((res) => {
                setLiveProduct(res.products);
              });
            setIsLiveEvent(true);
            setIsLiveProduct(true);
          }

          if (finishedArray.length >= 1) {
            const length = finishedArray.length - 1;
            const finishedEvent = finishedArray[length];
            setFinishedEvent(finishedEvent);
            setFinishedId(finishedEvent.id);
            const id = finishedEvent.id;
            fetch(`${baseURL}/live-event/${id}/products`)
              .then((res) => res.json())
              .then((res) => {
                setFinishedProduct(res.products);
              });
            setIsFinishedEvent(true);
            setIsFinishedProduct(true);
          }
        }
      });
  }, []);

  const sampleScheduledEventCardProps: ScheduledEventCardProps = {
    event: isScheduledEvent
      ? scheduledEvent
      : {
          id: "2",
          title: "대기중인 이벤트가 없습니다.",
          status: LiveStatus.LIVE,
          productIds: ["1"],
        },
    products: isScheduledProduct ? scheduledProduct : [],
    onDeleteAction: () => {
      if (!isScheduledEvent) {
        alert("삭제할 이벤트가 없습니다.");
        return;
      }
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: scheduledId,
        }),
      };

      fetch(`http://localhost:5000/live-event/${scheduledId}`, requestOptions)
      alert("이벤트가 삭제되었습니다.");
      setIsScheduledEvent(false);
      setIsScheduledProduct(false);
      history.push("/live-event");
    },
    onLiveEventAction: () => {
      if (!isScheduledProduct) {
        alert("방송할 이벤트가 없습니다.");
        return;
      }
      fetch(`http://localhost:5000/live-event/${scheduledId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: scheduledEvent.title,
          status: LiveStatus.LIVE,
          productIds: scheduledEvent.productIds,
        }),
      }).then((response) => {
        if (response.ok) {
          alert("해당 이벤트를 방송중으로 변경합니다.");
          history.push("/live-event");
        }
      });
    },
  };

  const sampleLiveEventCardProps: LiveEventCardProps = {
    event: isLiveEvent
      ? liveEvent
      : {
          id: "2",
          title: "진행중인 이벤트가 없습니다.",
          status: LiveStatus.LIVE,
          productIds: ["1"],
        },
    products: isLiveProduct ? liveProdcut : [],
    onDeleteAction: () => {
      if (!isLiveEvent) {
        alert("삭제할 이벤트가 없습니다.");
        return;
      }
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: liveId,
        }),
      };
      fetch(`http://localhost:5000/live-event/${liveId}`, requestOptions) //
        .then((response) => console.log(response));
      alert("이벤트가 삭제되었습니다.");
      setIsLiveEvent(false);
      setIsLiveProduct(false);
      history.push("/live-event");
    },
    onFinishedEventAction: () => {
      if (!isLiveProduct) {
        alert("방송할 이벤트가 없습니다.");
        return;
      }
      fetch(`http://localhost:5000/live-event/${liveId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: liveEvent.title,
          status: LiveStatus.FINISHED,
          productIds: liveEvent.productIds,
        }),
      }).then((response) => {
        if (response.ok) {
          alert("해당 이벤트를 종료합니다.");
          history.push("/live-event");
        }
      });
    },
  };

  const sampleFinishedEventCardProps: FinishedEventCardProps = {
    event: isFinishedEvent
      ? finishedEvent
      : {
          id: "2",
          title: "종료된 이벤트가 없습니다.",
          status: LiveStatus.LIVE,
          productIds: ["1"],
        },
    products: isFinishedProduct ? finishedProduct : [],
    onDeleteAction: () => {
      if (!isFinishedEvent) {
        alert("삭제할 이벤트가 없습니다.");
        return;
      }
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: finishedId,
        }),
      };
      fetch(`http://localhost:5000/live-event/${finishedId}`, requestOptions) //
        .then((response) => console.log(response));
      alert("이벤트가 삭제되었습니다.");
      setIsFinishedEvent(false);
      setIsFinishedProduct(false);
      history.push("/live-event");
    },
  };

  return (
    <Page
      title={"이벤트 대시보드"}
      fullWidth
      secondaryActions={[
        {
          content: "라이브 쇼핑 페이지로 이동",
          onAction: () => {
            window.location.href = "/live-shopping-page";
          },
        },
      ]}
      primaryAction={{
        content: "새 이벤트 생성하기",
        onAction: () => {
          history.push("create-live-event");
        },
      }}
    >
      <Layout>
        <Layout.Section oneThird>
          <Heading>방송 대기중인 이벤트</Heading>
          <ScheduledEventCard
            event={sampleScheduledEventCardProps.event}
            products={sampleScheduledEventCardProps.products}
            onDeleteAction={sampleScheduledEventCardProps.onDeleteAction}
            onLiveEventAction={sampleScheduledEventCardProps.onLiveEventAction}
          />
        </Layout.Section>
        <Layout.Section oneThird>
          <Heading>방송 중인 이벤트</Heading>
          <LiveEventCard
            event={sampleLiveEventCardProps.event}
            products={sampleLiveEventCardProps.products}
            onDeleteAction={sampleLiveEventCardProps.onDeleteAction}
            onFinishedEventAction={
              sampleLiveEventCardProps.onFinishedEventAction
            }
          />
        </Layout.Section>
        <Layout.Section oneThird>
          <Heading>방송 종료된 이벤트</Heading>
          <FinishedEventCard
            event={sampleFinishedEventCardProps.event}
            products={sampleFinishedEventCardProps.products}
            onDeleteAction={sampleFinishedEventCardProps.onDeleteAction}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
