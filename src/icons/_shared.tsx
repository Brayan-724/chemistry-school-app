export interface IconProps {
  name: string;
}
export function Icon(props: IconProps) {
  return <i class="icon-outlined">{props.name}</i>;
}

export function createIcon(name: string) {
  return (props: Omit<IconProps, "name">) => <Icon name={name} {...props} />;
}
