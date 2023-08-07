type SwimlaneTableHeaderProps = {
  orderedTaskStatuses: Array<string>,
}
export default function SwimlaneTableHeader(props: SwimlaneTableHeaderProps) {
  // [TODO] i18n 化
  const taskStatusesJa: { [key: string]: string } = {
    OPEN: '新規',
    INPROGRESS: '進行中',
    TOVERIFY: '解決',
    FEEDBACK: 'フィードバック',
    DONE: '終了',
    REJECT: '却下',
  };

  return (
    <tr>
      <th>ストーリー</th>
      { props.orderedTaskStatuses.map(s => <th key={ s }>{ taskStatusesJa[s] }</th>) }
    </tr>
  );
}
