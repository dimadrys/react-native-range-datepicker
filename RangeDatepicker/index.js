'use strict'
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    Button,
    TouchableOpacity
} from 'react-native';
import Month from './Month';
// import styles from './styles';
import moment from 'moment';

export default class RangeDatepicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: props.startDate && moment(props.startDate, 'MMM DD'),
            untilDate: props.untilDate && moment(props.untilDate, 'MMM DD'),
            availableDates: props.availableDates || null
        }

        this.onSelectDate = this.onSelectDate.bind(this);
        this.onReset = this.onReset.bind(this);
        this.handleConfirmDate = this.handleConfirmDate.bind(this);
        this.handleRenderRow = this.handleRenderRow.bind(this);
    }

    static defaultProps = {
        initialMonth: '',
        dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        maxMonth: 12,
		horizMargins: 0,
        buttonColor: 'green',
        buttonTextColor: 'white',
        buttonStyles: {},
        buttonContainerStyle: {},
        showReset: true,
        showClose: true,
        showDays: true,
        ignoreMinDate: false,
        isHistorical: false,
        onClose: () => {
        },
        onSelect: () => {
        },
        onConfirm: () => {
        },
        placeHolderStart: 'Start Date',
        placeHolderUntil: 'Until Date',
        placeHolderSeparator: '/',
        selectedBackgroundColor: 'green',
		firstLastDaysBg: 'green',
        selectedTextColor: 'white',
        todayColor: 'green',
        startDate: '',
        untilDate: '',
        minDate: '',
        maxDate: '',
        infoText: '',
        infoStyle: {color: '#fff', fontSize: 13},
        infoContainerStyle: {
            marginRight: 20,
            paddingHorizontal: 20,
            paddingVertical: 5,
            backgroundColor: 'green',
            borderRadius: 20,
            alignSelf: 'flex-end'
        },
        showSelectionInfo: true,
        selectionStyles: {fontSize: 34, color: '#666'},
        selectionContainerStyles: {},
        selectionFormat: 'MM DD',
        buttonText: 'Apply Date Range',
        showButton: true,
    };


    static propTypes = {
        initialMonth: PropTypes.string,
        dayHeadings: PropTypes.arrayOf(PropTypes.string),
        availableDates: PropTypes.arrayOf(PropTypes.string),
        maxMonth: PropTypes.number,
		horizMargins: PropTypes.number,
        buttonColor: PropTypes.string,
        buttonTextColor: PropTypes.string,
        buttonStyles: PropTypes.object,
        buttonContainerStyle: PropTypes.object,
        startDate: PropTypes.string,
        untilDate: PropTypes.string,
        minDate: PropTypes.string,
        maxDate: PropTypes.string,
        showReset: PropTypes.bool,
        showClose: PropTypes.bool,
        showDays: PropTypes.bool,
        ignoreMinDate: PropTypes.bool,
        isHistorical: PropTypes.bool,
        onClose: PropTypes.func,
        onSelect: PropTypes.func,
        onConfirm: PropTypes.func,
        placeHolderStart: PropTypes.string,
        placeHolderUntil: PropTypes.string,
        placeHolderSeparator: PropTypes.string,
        selectedBackgroundColor: PropTypes.string,
		firstLastDaysBg: PropTypes.string,
        selectedTextColor: PropTypes.string,
        todayColor: PropTypes.string,
        infoText: PropTypes.string,
        buttonText: PropTypes.string,
        infoStyle: PropTypes.object,
        infoContainerStyle: PropTypes.object,
        showSelectionInfo: PropTypes.bool,
        selectionStyles: PropTypes.object,
        selectionContainerStyles: PropTypes.object,
        selectionFormat: PropTypes.string,
        showButton: PropTypes.bool,
    }

    componentWillReceiveProps(nextProps) {
        this.setState({availableDates: nextProps.availableDates});
    }

    onSelectDate(date) {
        let startDate = null;
        let untilDate = null;
        const {availableDates} = this.state;

        if (this.state.startDate && !this.state.untilDate) {
            if (date.format('MM DD') < this.state.startDate.format('MM DD') || this.isInvalidRange(date)) {
                startDate = date;
            } else if (date.format('MM DD') > this.state.startDate.format('MM DD')) {
                startDate = this.state.startDate;
                untilDate = date;
            } else {
                startDate = null;
                untilDate = null;
            }
        } else if (!this.isInvalidRange(date)) {
            startDate = date;
        } else {
            startDate = null;
            untilDate = null;
        }

        this.setState({startDate, untilDate});
        this.props.onSelect(startDate, untilDate);
    }

    isInvalidRange(date) {
        const {startDate, untilDate, availableDates} = this.state;

        if (availableDates && availableDates.length > 0) {
            //select endDate condition
            if (startDate && !untilDate) {
                for (let i = startDate.format('MM DD'); i <= date.format('MM DD'); i = moment(i, 'MM DD').add(1, 'days').format('MM DD')) {
                    if (availableDates.indexOf(i) == -1 && startDate.format('MM DD') != i)
                        return true;
                }
            }
            //select startDate condition
            else if (availableDates.indexOf(date.format('MM DD')) == -1)
                return true;
        }

        return false;
    }

    getMonthStack() {
        let res = [];
        const {maxMonth, initialMonth, isHistorical} = this.props;
        let initMonth = moment();
        if (initialMonth && initialMonth != '')
            initMonth = moment(initialMonth, 'YYYYMM');

        for (let i = 0; i < maxMonth; i++) {
            res.push(
                !isHistorical ? (
                    initMonth.clone().add(i, 'month').format('YYYYMM')
                ) : (
                    initMonth.clone().subtract(i, 'month').format('YYYYMM')
                )
            );
        }

        return res;
    }

    onReset() {
        this.setState({
            startDate: null,
            untilDate: null,
        });

        this.props.onSelect(null, null);
    }

    handleConfirmDate() {
        this.props.onConfirm && this.props.onConfirm(this.state.startDate, this.state.untilDate);
    }

    handleRenderRow(month, index) {
        const {selectedBackgroundColor, selectedTextColor, todayColor, ignoreMinDate, minDate, maxDate, firstLastDaysBg, horizMargins } = this.props;
        let {availableDates, startDate, untilDate} = this.state;


        if (availableDates && availableDates.length > 0) {
            availableDates = availableDates.filter(function (d) {
                if (d.indexOf(month) >= 0)
                    return true;
            });
        }

        return (
            <Month
                onSelectDate={this.onSelectDate}
                startDate={startDate}
                untilDate={untilDate}
                availableDates={availableDates}
                minDate={minDate ? moment(minDate, 'MM DD') : minDate}
                maxDate={maxDate ? moment(maxDate, 'MM DD') : maxDate}
                ignoreMinDate={ignoreMinDate}
                dayProps={{selectedBackgroundColor, selectedTextColor, todayColor, firstLastDaysBg, horizMargins }}
                month={month}/>
        )
    }

    render() {
        return (
            <View style={{zIndex: 1000, alignSelf: 'center', width: '100%', flex: 1}}>
                {
                    this.props.showClose || this.props.showReset ?
                        (<View style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            padding: 20,
                            paddingBottom: 10
                        }}>
                            {
                                this.props.showClose &&
                                <Text style={{fontSize: 20}} onPress={this.props.onClose}>Close</Text>
                            }
                            {
                                this.props.showReset && <Text style={{fontSize: 20}} onPress={this.onReset}>Reset</Text>
                            }
                        </View>)
                        :
                        null
                }
                {
                    this.props.showSelectionInfo ?
                        (
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                paddingHorizontal: 20,
                                paddingBottom: 5,
                                alignItems: 'center', ...this.props.selectionContainerStyles
                            }}>
                                <Text
                                    style={this.props.selectionStyles}>{`${this.state.startDate ? moment(this.state.startDate).format(this.props.selectionFormat) : this.props.placeHolderStart}`}</Text>
                                <Text style={this.props.selectionStyles}>{` ${this.props.placeHolderSeparator} `}</Text>
                                <Text
                                    style={this.props.selectionStyles}>{`${this.state.untilDate ? moment(this.state.untilDate).format(this.props.selectionFormat) : this.props.placeHolderUntil}`}</Text>
                            </View>
                        ) : null
                }

                {
                    this.props.infoText != "" &&
                    <View style={this.props.infoContainerStyle}>
                        <Text style={this.props.infoStyle}>{this.props.infoText}</Text>
                    </View>
                }
                {this.props.showDays ? (<View style={styles.dayHeader}>
                    {
                        this.props.dayHeadings.map((day, i) => {
                            return (<Text style={{width: "14.28%", textAlign: 'center'}} key={i}>{day}</Text>)
                        })
                    }
                </View>) : null}
                <FlatList
                    style={{flex: 1}}
                    data={this.getMonthStack()}
                    renderItem={({item, index}) => {
                        return this.handleRenderRow(item, index)
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />

                {
                    this.props.showButton ?
                        (
                            <View style={this.props.buttonContainerStyle}>
                                <TouchableOpacity
                                    onPress={this.handleConfirmDate}
                                    style={this.props.buttonStyles}>
                                    <Text style={this.props.buttonTextColor}>{this.props.buttonText}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dayHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 10,
        paddingTop: 10,
    },
    buttonWrapper: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'stretch'
    },
});
