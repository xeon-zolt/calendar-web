import * as React from 'react'
import * as blockstack from 'blockstack'
import FAQs from '../FAQ'

interface IProps {
	user?: blockstack.Profile
}

const Help: React.FC<IProps> = (props: IProps) => <FAQs />

export default Help
